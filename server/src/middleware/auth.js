import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDatabaseConnected } from '../config/database.js';

export async function requireAuth(request, response, next) {
  if (!isDatabaseConnected()) return response.status(503).json({ message: 'Account services are temporarily unavailable because the database is disconnected.' });
  const header = request.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email role phone addresses +sessionVersion').lean();
    if (!user) return response.status(401).json({ message: 'User no longer exists' });
    if ((payload.sv || 0) !== (user.sessionVersion || 0)) {
      return response.status(401).json({ message: 'Your session has expired. Please sign in again.' });
    }
    request.user = user;
    return next();
  } catch (error) {
    if (error.name === 'MongooseError' || error.name === 'MongoServerSelectionError') {
      return response.status(503).json({ message: 'Account services are temporarily unavailable because the database is disconnected.' });
    }
    return response.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ message: 'You do not have permission for this action' });
    }
    return next();
  };
}
