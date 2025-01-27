import { Router } from 'express';
import { getTransactions } from '../controllers/transactionController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/transactions/:userId', authMiddleware, getTransactions);

export default router;
