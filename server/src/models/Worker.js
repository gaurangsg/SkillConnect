import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  skill: { type: String, required: true, trim: true, index: true },
  imageUrl: { type: String, required: true, trim: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  verified: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
}, { timestamps: true });

workerSchema.index({ name: 'text', skill: 'text' });

export default mongoose.model('Worker', workerSchema);
