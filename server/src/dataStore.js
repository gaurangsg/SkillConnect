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

const legacyServiceSkills = {
  carpentry: ['Carpenter'],
  electrician: ['Electrician'],
  plumbing: ['Plumber'],
  painting: ['Painter'],
  cleaning: ['Cleaner'],
  'ac-repair': ['AC Technician', 'HVAC Technician'],
  masonry: ['Mason', 'Welder', 'Site Observer'],
  gardening: ['Gardener'],
};

function matchesWorker(worker, { search, serviceId, featuredOnly }) {
  if (featuredOnly && !worker.featured) return false;
  if (serviceId && worker.serviceId !== serviceId) return false;
  if (!search) return true;
  const searchableFields = [worker.name, worker.skill, worker.bio, ...(worker.specialties || [])];
  return searchableFields.some((field) => String(field || '').toLowerCase().includes(search.toLowerCase()));
}

export async function listWorkers({ search = '', serviceId = '', featuredOnly = false } = {}) {
  if (!isDatabaseConnected()) {
    return fallbackWorkers.filter((worker) => matchesWorker(worker, { search, serviceId, featuredOnly }));
  }

  const filters = [];
  if (featuredOnly) filters.push({ featured: true });
  if (serviceId) {
    const legacySkills = legacyServiceSkills[serviceId] || [];
    filters.push({
      $or: [
        { serviceId },
        ...legacySkills.map((skill) => ({
          serviceId: { $exists: false },
          skill: new RegExp(`^${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        })),
      ],
    });
  }
  if (search) {
    const searchPattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filters.push({
      $or: [
        { name: searchPattern },
        { skill: searchPattern },
        { bio: searchPattern },
        { specialties: searchPattern },
      ],
    });
  }

  const query = filters.length > 1 ? { $and: filters } : filters[0] || {};
  const documents = await Worker.find(query).sort({ featured: -1, rating: -1, name: 1 }).lean();
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
