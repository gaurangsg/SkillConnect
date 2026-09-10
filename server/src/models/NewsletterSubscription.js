import mongoose from 'mongoose';

const newsletterSubscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
}, { timestamps: true });

export default mongoose.model('NewsletterSubscription', newsletterSubscriptionSchema);
