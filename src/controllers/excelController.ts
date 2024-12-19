import { Request, Response } from 'express';
import path from 'path';
import { processCSVFile } from '../services/excelSyndService';
import { processExcelFile } from '../services/excelWDService';

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
        
        // Determine the file type
        const mimeType = req.file.mimetype;
        const extension = path.extname(req.file.originalname).toLowerCase();

        let result;

        if (mimeType === 'text/csv' || extension === '.csv') {
            console.log("sent to processCSVFile");
            result = await processCSVFile(req.file.buffer);
        } else if (
            mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            mimeType === 'application/vnd.ms-excel' ||
            extension === '.xlsx' ||
            extension === '.xls'
        ) {
            console.log("sent to processExcelFile");
            result = await processExcelFile(req.file.buffer);
        } else {
            res.status(400).json({ error: 'Unsupported file type' });
            return;
        }

        res.status(200).json({ message: 'File processed successfully', savedCount: result.savedCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
};
