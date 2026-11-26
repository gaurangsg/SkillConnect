import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { isDatabaseConnected } from '../config/database.js';

const router = express.Router();
router.use((_request, response, next) => {
  if (!isDatabaseConnected()) return response.status(503).json({ message: 'Account services are unavailable until MongoDB reconnects.' });
  return next();
});

function createToken(user) {
  return jwt.sign({ role: user.role, sv: user.sessionVersion || 0 }, process.env.JWT_SECRET, {
    subject: user._id.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role, phone: user.phone || null, addresses: user.addresses || [] };
}

function hashResetToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

router.post('/register', async (request, response, next) => {
  const name = String(request.body?.name || '').trim();
  const email = String(request.body?.email || '').trim().toLowerCase();
  const password = String(request.body?.password || '');
  const phone = String(request.body?.phone || '').trim();
  const role = request.body?.role === 'worker' ? 'worker' : 'customer';

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return response.status(400).json({ message: 'Name, valid email, and a password of at least 8 characters are required' });
  }

  try {
    const existingUser = await User.exists({ email });
    if (existingUser) return response.status(409).json({ message: 'An account with that email already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, phone, role });
    return response.status(201).json({ user: publicUser(user), token: createToken(user) });
  } catch (error) {
    return next(error);
  }
});

router.post('/forgot-password', async (request, response, next) => {
  const email = String(request.body?.email || '').trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({ message: 'A valid email address is required' });
  }
  if (process.env.NODE_ENV === 'production') {
    return response.status(503).json({ message: 'Password reset email delivery is not configured yet.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(202).json({ message: 'If an account exists for that email, reset instructions are ready.' });
    }

    const resetToken = randomBytes(32).toString('hex');
    user.passwordResetTokenHash = hashResetToken(resetToken);
    user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    return response.status(202).json({
      message: 'A development-only reset link is ready. It expires in 15 minutes.',
      resetToken,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/reset-password', async (request, response, next) => {
  const token = String(request.body?.token || '').trim();
  const password = String(request.body?.password || '');
  if (!/^[\da-f]{64}$/i.test(token) || password.length < 8 || password.length > 128) {
    return response.status(400).json({ message: 'A valid reset token and a password between 8 and 128 characters are required' });
  }

  try {
    const user = await User.findOne({
      passwordResetTokenHash: hashResetToken(token),
      passwordResetExpiresAt: { $gt: new Date() },
    }).select('+passwordResetTokenHash +passwordResetExpiresAt +sessionVersion');
    if (!user) return response.status(400).json({ message: 'This password reset link is invalid or has expired.' });

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    user.sessionVersion = (user.sessionVersion || 0) + 1;
    await user.save();

    return response.json({ message: 'Password updated. Sign in with your new password.' });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (request, response, next) => {
  const email = String(request.body?.email || '').trim().toLowerCase();
  const password = String(request.body?.password || '');

  try {
    const user = await User.findOne({ email }).select('+passwordHash +sessionVersion');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return response.status(401).json({ message: 'Invalid email or password' });
    }
    return response.json({ user: publicUser(user), token: createToken(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAuth, (request, response) => {
  response.json({ user: publicUser(request.user) });
});

router.patch('/profile', requireAuth, async (request, response, next) => {
  const name = String(request.body?.name || '').trim();
  const phone = String(request.body?.phone || '').trim();
  const addresses = Array.isArray(request.body?.addresses) ? request.body.addresses : [];

  if (name.length < 2 || name.length > 80) return response.status(400).json({ message: 'Name must be between 2 and 80 characters' });
  if (phone.length > 30) return response.status(400).json({ message: 'Phone number must be 30 characters or fewer' });
  if (addresses.length > 5 || addresses.some((address) => typeof address?.label !== 'string' || address.label.trim().length > 300)) {
    return response.status(400).json({ message: 'Add up to five service addresses, each up to 300 characters' });
  }

  try {
    const normalizedAddresses = addresses
      .map((address, index) => ({ label: address.label.trim(), isDefault: Boolean(address.isDefault) || (!addresses.some((entry) => entry.isDefault) && index === 0) }))
      .filter((address) => address.label);
    const user = await User.findByIdAndUpdate(request.user._id, { name, phone, addresses: normalizedAddresses }, { new: true, runValidators: true });
    return response.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
