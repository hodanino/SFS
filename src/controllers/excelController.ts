import { Request, Response } from 'express';
import path from 'path';
import { processSyndicationFile } from '../services/excelSyndCommService';
import { processExcelWDFile } from '../services/excelWDService';

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
        
        const originalName = req.file.originalname;
        //TODO: check if not starts with 'Synd' it should start with 'syndication' - else throw exs
        const isSyndicationFile = originalName.startsWith('Synd ');
        
        let result;
        if (isSyndicationFile) {
            result = await processSyndicationFile(req.file.buffer);
            res.status(200).json({ 
                message: 'Syndication file processed successfully',
                fileName: originalName, 
                savedCount: result.savedCount,
                type: 'syndication'
            });
        } else {
            result = await processExcelWDFile(req.file.buffer);
            res.status(200).json({ 
                message: 'W/D file processed successfully',
                fileName: originalName,  
                savedCount: result.savedCount,
                type: 'withdrawal'
            });
        }
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to process file', 
            details: error.message,
            filename: req.file?.originalname // Include filename in error for debugging
        });
    }
};
