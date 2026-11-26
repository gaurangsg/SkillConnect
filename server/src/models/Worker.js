import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  skill: { type: String, required: true, trim: true, index: true },
  serviceId: { type: String, trim: true, index: true },
  imageUrl: { type: String, required: true, trim: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  experienceYears: { type: Number, min: 0, default: null },
  completedJobs: { type: Number, min: 0, default: 0 },
  responseTime: { type: String, trim: true, default: '' },
  bio: { type: String, trim: true, maxlength: 1200, default: '' },
  specialties: { type: [String], default: [] },
  serviceAreas: { type: [String], default: [] },
  languages: { type: [String], default: [] },
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false, index: true },
  isDemo: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
}, { timestamps: true });

workerSchema.index({ name: 'text', skill: 'text' });

export default mongoose.model('Worker', workerSchema);
