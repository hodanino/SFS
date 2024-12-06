import { Router } from 'express';
import { getTransactions } from '../controllers/transactionController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Get transactions for a specific user
router.get('/transactions/:userId', authMiddleware, getTransactions);

export default router;
