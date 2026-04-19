import { Router } from 'express';
import { googleCallback, googleStart, me } from '../controllers/authController.js';

const router = Router();

router.get('/google', googleStart);
router.get('/google/callback', ...googleCallback);
router.get('/me', me);

export default router;
