import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
      const error = new Error('Authentication required');
      error.status = 401;
      throw error;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 401;
      throw error;
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    const error = new Error('Admin access required');
    error.status = 403;
    return next(error);
  }
  return next();
};
