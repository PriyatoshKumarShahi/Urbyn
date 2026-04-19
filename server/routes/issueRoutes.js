import { Router } from 'express';
import {
  createIssue,
  deleteIssue,
  getIssueById,
  getIssues,
  getNearbyIssues,
  updateIssueStatus,
  upvoteIssue,
  verifyIssue
} from '../controllers/issueController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getIssues);
router.get('/nearby', getNearbyIssues);
router.get('/:id', getIssueById);
router.post('/', protect, createIssue);
router.delete('/:id', protect, deleteIssue);
router.post('/:id/upvote', protect, upvoteIssue);
router.post('/:id/verify', protect, verifyIssue);
router.patch('/:id/status', protect, adminOnly, updateIssueStatus);

export default router;
