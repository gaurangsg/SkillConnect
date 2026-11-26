import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not configured; using in-memory demo data.');
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 7000 });
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'production') throw error;
    console.warn(`MongoDB is unavailable (${error.code || 'connection error'}); starting the API in read-only demo mode.`);
    return false;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
