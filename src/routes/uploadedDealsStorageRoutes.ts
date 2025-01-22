import { Router } from 'express';
import { deleteDeal, downloadTemporaryStorage, getCurrentStorage } from '../controllers/storageController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.get('/download-storage', authMiddleware, downloadTemporaryStorage);
router.get('/get-storage', authMiddleware, getCurrentStorage);
router.delete('/delete-deal/:dealName',authMiddleware, deleteDeal);

export default router;
