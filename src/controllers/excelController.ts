import { Request, Response } from 'express';
import { processExcelFile } from '../services/excelService';

export const uploadExcel = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: No user information' });
            return;
        }

        if (req.user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const result = await processExcelFile(req.file.buffer);
        res.status(200).json({ message: 'File processed successfully', savedCount: result.savedCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
};
