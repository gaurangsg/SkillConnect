import app from '../server/src/app.js';
import { connectDatabase, isDatabaseConnected } from '../server/src/config/database.js';
import { validateEnvironment } from '../server/src/config/environment.js';

let connectionPromise;

async function ensureDatabaseConnection() {
  validateEnvironment();

  if (isDatabaseConnected()) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = connectDatabase()
      .then((connected) => {
        if (!connected || !isDatabaseConnected()) {
          throw new Error('MongoDB connection was not established');
        }
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  await connectionPromise;
  if (!isDatabaseConnected()) {
    connectionPromise = undefined;
    throw new Error('MongoDB connection was lost');
  }
}

export default async function handler(request, response) {
  try {
    await ensureDatabaseConnection();
  } catch (error) {
    console.error('Vercel API initialization failed:', error);
    return response.status(503).json({ message: 'Account services are temporarily unavailable.' });
  }

  return app(request, response);
}
