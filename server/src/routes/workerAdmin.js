import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth, requireRole('admin'));

router.patch('/:workerId/assign', async (request, response, next) => {
  const { userId } = request.body || {};
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return response.status(400).json({ message: 'A valid worker userId is required' });
  }

  try {
    const [worker, user] = await Promise.all([
      Worker.findById(request.params.workerId),
      User.findOne({ _id: userId, role: 'worker' }).select('_id name email role'),
    ]);
    if (!worker) return response.status(404).json({ message: 'Worker profile not found' });
    if (!user) return response.status(404).json({ message: 'Worker account not found' });

    const assignedProfile = await Worker.findOne({ userId: user._id, _id: { $ne: worker._id } }).select('_id');
    if (assignedProfile) return response.status(409).json({ message: 'This account is already assigned to another worker profile' });

    worker.userId = user._id;
    await worker.save();
    return response.json({ workerId: worker._id, userId: user._id, message: 'Worker account assigned' });
  } catch (error) {
    return next(error);
  }
});

export default router;
