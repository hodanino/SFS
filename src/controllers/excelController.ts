import { Request, Response } from 'express';
import xlsx from 'xlsx';
import { excelNameToUserId } from '../helpers/excelNameToUserId';
import Transaction from '../models/Transaction';

export const uploadExcel = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if the user is authenticated and authorized
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: No user information' });
            return;
        }

        // Optional: Check if the user has an "admin" role or other role check
        if (req.user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
            return;
        }

        // Check if a file is uploaded
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const excelNameToUserIdMap = await excelNameToUserId();

        // Parse the Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        console.log("parsed sheet");
        const sheetName = workbook.SheetNames[0]; 
        const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log("before cleaning date, raw data=  " + rawData);

        
        const cleanedData = rawData
        .map((row: any) => {
            const userId = excelNameToUserIdMap[row['Investor']]; 
            if (!userId) {
                console.warn(`No userId found for Investor: ${row['Investor']}`);
                return null; 
            }
            return {
                userId,
                date: new Date(), 
                type: 'W/D',
                description: row['Deal Name'],
                credit: parseFloat(row['Balance']) || 0,
                debit: 0,
            };
        })
        .filter((transaction) => transaction !== null && transaction.credit != 0); 


        // Validate cleaned data
        const validData = cleanedData.filter(
            (transaction) =>
                transaction.userId &&
                transaction.date &&
                transaction.type &&
                transaction.description &&
                transaction.credit > 0
        );
        console.log("before insertion, valid date: " + validData);
        // Save valid data to the database
        await Transaction.insertMany(validData);
        
        res.status(200).json({ message: 'File processed successfully', savedCount: validData.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
};
