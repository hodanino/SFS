import { Router } from 'express';
import { uploadExcel } from '../controllers/excelController';
import authMiddleware from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/upload-excel', authMiddleware, upload.single('file'), uploadExcel);

export default router;
