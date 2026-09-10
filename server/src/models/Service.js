import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  icon: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
