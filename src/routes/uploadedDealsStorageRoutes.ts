import { Router } from 'express';
import { downloadTemporaryStorage, getCurrentStorage } from '../controllers/storageController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/download-storage', authMiddleware, downloadTemporaryStorage);
router.get('/get-storage', authMiddleware, getCurrentStorage);

export default router;
