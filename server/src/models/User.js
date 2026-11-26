import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  passwordResetTokenHash: { type: String, select: false },
  passwordResetExpiresAt: { type: Date, select: false },
  sessionVersion: { type: Number, default: 0, select: false },
  role: { type: String, enum: ['customer', 'worker', 'admin'], default: 'customer' },
  phone: { type: String, trim: true, maxlength: 30 },
  addresses: [{
    label: { type: String, trim: true, maxlength: 300 },
    isDefault: { type: Boolean, default: false },
  }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
