import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { reviews, services, workers } from './data.js';
import Review from './models/Review.js';
import Service from './models/Service.js';
import Worker from './models/Worker.js';

dotenv.config();

await connectDatabase();

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is required to seed the database.');
}

await Promise.all([
  ...services.map(({ id, ...service }) => Service.updateOne({ _id: id }, { $set: service }, { upsert: true })),
  ...workers.map(({ id, ...worker }) => Worker.updateOne({ _id: id }, { $set: worker }, { upsert: true })),
  ...reviews.map(({ id, ...review }) => Review.updateOne({ _id: id }, { $set: review }, { upsert: true })),
]);

console.log('Seeded SkillConnect catalog data.');
process.exit(0);
