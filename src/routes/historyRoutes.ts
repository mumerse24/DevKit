import { Router } from 'express';
import { saveActivity, getHistory, deleteHistoryItem, clearHistory } from '../controllers/historyController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Secure all history paths using JWT verify middleware
router.use(authenticateToken as any);

router.post('/', saveActivity);
router.get('/', getHistory);
router.delete('/:id', deleteHistoryItem);
router.delete('/', clearHistory);

export default router;
