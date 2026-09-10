import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { findWorkerById, findWorkerByUserId, listServices } from '../dataStore.js';

const router = express.Router();
router.use(requireAuth);

router.post('/', async (request, response, next) => {
  const { workerId, serviceId, scheduledFor, address, description } = request.body || {};
  const appointmentDate = new Date(scheduledFor);

  if (!workerId || !serviceId || !scheduledFor || !address || !description || Number.isNaN(appointmentDate.getTime())) {
    return response.status(400).json({ message: 'workerId, serviceId, scheduledFor, address, and description are required' });
  }
  if (appointmentDate <= new Date()) {
    return response.status(400).json({ message: 'scheduledFor must be in the future' });
  }

  try {
    const [worker, services] = await Promise.all([findWorkerById(workerId), listServices()]);
    if (!worker) return response.status(404).json({ message: 'Worker not found' });
    if (!services.some((service) => service.id === serviceId)) return response.status(404).json({ message: 'Service not found' });

    const booking = await Booking.create({
      customerId: request.user._id,
      workerId,
      serviceId,
      scheduledFor: appointmentDate,
      address,
      description,
    });
    return response.status(201).json({ booking });
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (request, response, next) => {
  try {
    let query;
    if (request.user.role === 'admin') {
      query = {};
    } else if (request.user.role === 'worker') {
      const worker = await findWorkerByUserId(request.user._id);
      if (!worker) return response.status(403).json({ message: 'Worker profile is not assigned yet' });
      query = { workerId: worker._id };
    } else {
      query = { customerId: request.user._id };
    }
    const bookings = await Booking.find(query).sort({ scheduledFor: 1 }).lean();
    return response.json({ items: bookings, total: bookings.length });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/status', async (request, response, next) => {
  const allowedStatuses = request.user.role === 'customer'
    ? ['cancelled']
    : ['confirmed', 'completed', 'cancelled'];
  const { status } = request.body || {};
  if (!allowedStatuses.includes(status)) {
    return response.status(400).json({ message: 'status must be confirmed, completed, or cancelled' });
  }
  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    return response.status(400).json({ message: 'Invalid booking id' });
  }

  try {
    let query;
    if (request.user.role === 'admin') {
      query = { _id: request.params.id };
    } else if (request.user.role === 'worker') {
      const worker = await findWorkerByUserId(request.user._id);
      if (!worker) return response.status(403).json({ message: 'Worker profile is not assigned yet' });
      query = { _id: request.params.id, workerId: worker._id };
    } else {
      query = { _id: request.params.id, customerId: request.user._id };
    }
    const booking = await Booking.findOneAndUpdate(query, { status }, { new: true, runValidators: true }).lean();
    if (!booking) return response.status(404).json({ message: 'Booking not found' });
    return response.json({ booking });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireRole('admin'), async (request, response, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(request.params.id).lean();
    if (!booking) return response.status(404).json({ message: 'Booking not found' });
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
