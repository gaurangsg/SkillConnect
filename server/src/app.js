import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { isDatabaseConnected } from './config/database.js';
import { createNewsletterSubscription, findWorkerById, listReviews, listServices, listWorkers } from './dataStore.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import workerAdminRoutes from './routes/workerAdmin.js';

dotenv.config();

const app = express();
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin/workers', workerAdminRoutes);

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'skillconnect-api', database: isDatabaseConnected() ? 'connected' : 'demo' });
});

app.get('/api/services', async (_request, response, next) => {
  try {
    response.json(await listServices());
  } catch (error) {
    next(error);
  }
});

app.get('/api/workers', async (request, response, next) => {
  const search = String(request.query.search || '').trim().toLowerCase();
  const skill = String(request.query.skill || '').trim().toLowerCase();
  try {
    const filteredWorkers = await listWorkers({ search, skill });
    response.json({ items: filteredWorkers, total: filteredWorkers.length });
  } catch (error) {
    next(error);
  }
});

app.get('/api/workers/:id', async (request, response, next) => {
  try {
    const worker = await findWorkerById(request.params.id);
    if (!worker) {
      return response.status(404).json({ message: 'Worker not found' });
    }
    return response.json(worker);
  } catch (error) {
    return next(error);
  }
});

app.get('/api/reviews', async (_request, response, next) => {
  try {
    response.json(await listReviews());
  } catch (error) {
    next(error);
  }
});

app.post('/api/newsletter/subscriptions', async (request, response, next) => {
  const email = String(request.body?.email || '').trim();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({ message: 'A valid email is required' });
  }
  try {
    const subscription = await createNewsletterSubscription(email);
    return response.status(201).json({ message: 'Subscription received', ...subscription });
  } catch (error) {
    return next(error);
  }
});

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found' });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: 'Internal server error' });
});

export default app;
