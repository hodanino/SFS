import { Request, Response } from 'express';
import xlsx from 'xlsx';
import { excelNameToUserId } from '../helpers/excelNameToUserId';
import { updateUserTotals } from '../helpers/updateUserTotals';
import DataToUpdate from '../interfaces/updateTrans';
import Transaction from '../models/Transaction';

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

        const excelNameToUserIdMap = await excelNameToUserId();

        // Parse the Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        console.log("parsed sheet");
        const sheetName = workbook.SheetNames[0]; 
        const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log("before cleaning date, raw data=  " + rawData);

        const userWDUpdates = new Map<string, number>();
        
        const cleanedData = rawData
            .map((row: any) => {
                const userId = excelNameToUserIdMap[row['Investor']]; 
                if (!userId) {
                    console.warn(`No userId found for Investor: ${row['Investor']}`);
                    return null; 
                }

                const credit = parseFloat(row['Balance']) || 0;

                // Increment totalWD in the map
                if (credit != 0) {
                    userWDUpdates.set(
                        userId,
                        (userWDUpdates.get(userId) || 0) + credit
                    );
                }

                return {
                    userId,
                    date: new Date(), 
                    type: 'W/D',
                    description: row['Deal Name'],
                    credit,
                    debit: 0,
                };
            })
            .filter((transaction) => transaction !== null && transaction.credit !== 0);



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
        await Transaction.insertMany(validData);

        const updates: DataToUpdate[] = [];
        userWDUpdates.forEach((totalWD, userId) => {
            updates.push({
                userId,
                type: 'W/D',
                amount: totalWD,
            });
        });

        await Promise.all(
            updates.map((update) => updateUserTotals(update))
        );        
        
        res.status(200).json({ message: 'File processed successfully', savedCount: validData.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
};
