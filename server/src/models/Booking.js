import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  workerId: { type: String, required: true, index: true },
  serviceId: { type: String, required: true, index: true },
  scheduledFor: { type: Date, required: true, index: true },
  address: { type: String, required: true, trim: true, maxlength: 300 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending', index: true },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
