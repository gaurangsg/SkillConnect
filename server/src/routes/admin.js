import express from 'express';
import Booking from '../models/Booking.js';
import NewsletterSubscription from '../models/NewsletterSubscription.js';
import Review from '../models/Review.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth, requireRole('admin'));

const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

router.get('/overview', async (_request, response, next) => {
  try {
    const firstMonth = new Date();
    firstMonth.setUTCDate(1);
    firstMonth.setUTCHours(0, 0, 0, 0);
    firstMonth.setUTCMonth(firstMonth.getUTCMonth() - 5);

    const [statusRows, roleRows, workerProfiles, assignedProfiles, services, reviewSummary, newsletterSubscribers, recentBookings, recentUsers, monthlyBookings, serviceBreakdown] = await Promise.all([
      Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Worker.countDocuments(),
      Worker.countDocuments({ userId: { $ne: null } }),
      Service.countDocuments(),
      Review.aggregate([{ $group: { _id: null, count: { $sum: 1 }, averageRating: { $avg: '$rating' } } }]),
      NewsletterSubscription.countDocuments(),
      Booking.find().sort({ createdAt: -1 }).limit(6).populate('customerId', 'name email').lean(),
      User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(6).lean(),
      Booking.aggregate([
        { $match: { createdAt: { $gte: firstMonth } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Booking.aggregate([
        { $group: { _id: '$serviceId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
    ]);

    const workerIds = [...new Set(recentBookings.map((booking) => booking.workerId))];
    const serviceIds = [...new Set([...recentBookings.map((booking) => booking.serviceId), ...serviceBreakdown.map((item) => item._id)])];
    const [workers, serviceDocuments] = await Promise.all([
      Worker.find({ _id: { $in: workerIds } }).select('name skill').lean(),
      Service.find({ _id: { $in: serviceIds } }).select('name').lean(),
    ]);
    const workerNames = new Map(workers.map((worker) => [worker._id, worker]));
    const serviceNames = new Map(serviceDocuments.map((service) => [service._id, service.name]));
    const statusCounts = Object.fromEntries(statuses.map((status) => [status, 0]));
    statusRows.forEach(({ _id, count }) => { if (_id in statusCounts) statusCounts[_id] = count; });
    const roleCounts = Object.fromEntries(['customer', 'worker', 'admin'].map((role) => [role, 0]));
    roleRows.forEach(({ _id, count }) => { if (_id in roleCounts) roleCounts[_id] = count; });
    const orderTotal = Object.values(statusCounts).reduce((total, count) => total + count, 0);

    return response.json({
      metrics: {
        orders: orderTotal,
        pendingOrders: statusCounts.pending,
        confirmedOrders: statusCounts.confirmed,
        completedOrders: statusCounts.completed,
        cancelledOrders: statusCounts.cancelled,
        customers: roleCounts.customer,
        workerAccounts: roleCounts.worker,
        admins: roleCounts.admin,
        workerProfiles,
        assignedWorkerProfiles: assignedProfiles,
        services,
        reviews: reviewSummary[0]?.count || 0,
        averageRating: Number((reviewSummary[0]?.averageRating || 0).toFixed(1)),
        newsletterSubscribers,
      },
      ordersByStatus: statuses.map((status) => ({ status, count: statusCounts[status] })),
      ordersByMonth: monthlyBookings.map(({ _id, count }) => ({ month: _id, count })),
      ordersByService: serviceBreakdown.map(({ _id, count }) => ({
        serviceId: _id,
        serviceName: serviceNames.get(_id) || _id || 'Other',
        count,
      })),
      recentOrders: recentBookings.map((booking) => ({
        ...booking,
        customerName: booking.customerId?.name || 'Customer',
        customerEmail: booking.customerId?.email || '',
        workerName: workerNames.get(booking.workerId)?.name || 'Unassigned professional',
        serviceName: serviceNames.get(booking.serviceId) || booking.serviceId,
      })),
      recentUsers: recentUsers.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/bookings', async (request, response, next) => {
  const page = parsePositiveInteger(request.query.page, 1);
  const limit = Math.min(parsePositiveInteger(request.query.limit, 10), 50);
  const status = String(request.query.status || '').trim().toLowerCase();
  const search = String(request.query.search || '').trim().slice(0, 100);
  if (status && !statuses.includes(status)) {
    return response.status(400).json({ message: 'status must be pending, confirmed, completed, or cancelled' });
  }

  try {
    const query = {};
    if (status) query.status = status;
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      const [matchingCustomers, matchingWorkers] = await Promise.all([
        User.find({ role: 'customer', $or: [{ name: regex }, { email: regex }] }).select('_id').limit(100).lean(),
        Worker.find({ $or: [{ name: regex }, { skill: regex }] }).select('_id').limit(100).lean(),
      ]);
      query.$or = [
        { serviceId: regex },
        { workerId: regex },
        { address: regex },
        { description: regex },
        { customerId: { $in: matchingCustomers.map((user) => user._id) } },
        { workerId: { $in: matchingWorkers.map((worker) => worker._id) } },
      ];
    }

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(query),
      Booking.find(query)
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);
    const workerIds = [...new Set(bookings.map((booking) => booking.workerId))];
    const serviceIds = [...new Set(bookings.map((booking) => booking.serviceId))];
    const [workers, serviceDocuments] = await Promise.all([
      Worker.find({ _id: { $in: workerIds } }).select('name skill').lean(),
      Service.find({ _id: { $in: serviceIds } }).select('name').lean(),
    ]);
    const workerNames = new Map(workers.map((worker) => [worker._id, worker]));
    const serviceNames = new Map(serviceDocuments.map((service) => [service._id, service.name]));
    const items = bookings.map((booking) => ({
      ...booking,
      customerName: booking.customerId?.name || 'Customer',
      customerEmail: booking.customerId?.email || '',
      workerName: workerNames.get(booking.workerId)?.name || 'Unassigned professional',
      workerSkill: workerNames.get(booking.workerId)?.skill || '',
      serviceName: serviceNames.get(booking.serviceId) || booking.serviceId,
    }));

    return response.json({ items, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    return next(error);
  }
});

router.get('/users', async (request, response, next) => {
  const page = parsePositiveInteger(request.query.page, 1);
  const limit = Math.min(parsePositiveInteger(request.query.limit, 10), 50);
  const role = String(request.query.role || '').trim().toLowerCase();
  const search = String(request.query.search || '').trim().slice(0, 100);
  if (role && !['customer', 'worker', 'admin'].includes(role)) {
    return response.status(400).json({ message: 'role must be customer, worker, or admin' });
  }

  try {
    const query = {};
    if (role) query.role = role;
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).select('name email role createdAt').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);
    return response.json({
      items: users.map((user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt })),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
