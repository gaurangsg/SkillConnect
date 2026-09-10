import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  text: { type: String, required: true, trim: true },
  workerId: { type: String, default: null, index: true },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
