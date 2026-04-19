import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();
router.get('/dashboard', protect, adminOnly, getDashboardAnalytics);
export default router;
