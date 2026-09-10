import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function createToken(user) {
  return jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
    subject: user._id.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role, phone: user.phone || null };
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

router.post('/login', async (request, response, next) => {
  const email = String(request.body?.email || '').trim().toLowerCase();
  const password = String(request.body?.password || '');

  try {
    const user = await User.findOne({ email }).select('+passwordHash');
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

export default router;
