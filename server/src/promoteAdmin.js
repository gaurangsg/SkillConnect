import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const email = String(process.argv[2] || '').trim().toLowerCase();
if (!/^\S+@\S+\.\S+$/.test(email)) {
  throw new Error('Usage: npm run promote-admin -- existing-user@example.com');
}
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required to promote an administrator.');
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email }).select('+sessionVersion');
  if (!user) {
    throw new Error(`No SkillConnect account exists for ${email}. Register that account first.`);
  }
  if (user.role !== 'admin') {
    user.role = 'admin';
    user.sessionVersion = (user.sessionVersion || 0) + 1;
    await user.save();
  }
  console.log(`Administrator access is enabled for ${email}. Sign out and sign back in to refresh the account role.`);
} finally {
  await mongoose.disconnect();
}
