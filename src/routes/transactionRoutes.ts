import { Router } from 'express';
import { getTransactions } from '../controllers/transactionController';
import authenticateToken from '../middleware/authMiddleware';

const router = Router();

// Get transactions for a specific user
router.get('/transactions/:userId', authenticateToken, getTransactions);

export default router;
