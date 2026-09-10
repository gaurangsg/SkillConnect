import { isDatabaseConnected } from './config/database.js';
import { reviews as fallbackReviews, services as fallbackServices, workers as fallbackWorkers } from './data.js';
import NewsletterSubscription from './models/NewsletterSubscription.js';
import Review from './models/Review.js';
import Service from './models/Service.js';
import Worker from './models/Worker.js';

function normalizeDocument(document) {
  if (!document) return document;
  const value = document.toObject ? document.toObject() : document;
  if (value._id) {
    value.id = value._id;
    delete value._id;
  }
  delete value.__v;
  return value;
}

export async function listServices() {
  if (!isDatabaseConnected()) return fallbackServices;
  const documents = await Service.find().sort({ name: 1 }).lean();
  return documents.map(normalizeDocument);
}

export async function listWorkers({ search = '', skill = '' }) {
  if (!isDatabaseConnected()) {
    const normalizedSearch = search.toLowerCase();
    const normalizedSkill = skill.toLowerCase();
    return fallbackWorkers.filter((worker) => {
      const matchesSearch = !normalizedSearch || `${worker.name} ${worker.skill}`.toLowerCase().includes(normalizedSearch);
      const matchesSkill = !normalizedSkill || worker.skill.toLowerCase() === normalizedSkill;
      return matchesSearch && matchesSkill;
    });
  }

  const query = {};
  if (skill) query.skill = new RegExp(`^${skill.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}$`, 'i');
  if (search) query.$text = { $search: search };
  const documents = await Worker.find(query).sort({ rating: -1, name: 1 }).lean();
  return documents.map(normalizeDocument);
}

export async function findWorkerById(id) {
  if (!isDatabaseConnected()) return fallbackWorkers.find((worker) => worker.id === id);
  return normalizeDocument(await Worker.findById(id).lean());
}

export async function findWorkerByUserId(userId) {
  if (!isDatabaseConnected()) return undefined;
  return Worker.findOne({ userId }).lean();
}

export async function listReviews() {
  if (!isDatabaseConnected()) return fallbackReviews;
  const documents = await Review.find().sort({ createdAt: -1 }).lean();
  return documents.map(normalizeDocument);
}

export async function createNewsletterSubscription(email) {
  if (!isDatabaseConnected()) return { email };
  const subscription = await NewsletterSubscription.findOneAndUpdate(
    { email },
    { $setOnInsert: { email } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  return normalizeDocument(subscription);
}
