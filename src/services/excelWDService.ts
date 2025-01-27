import xlsx from 'xlsx';
import { excelNameToUserId } from '../helpers/excelNameToUserId';
import Transaction from '../models/Transaction';
import DataToUpdate from '../interfaces/UpdateTrans';
import { GoogleSheetsController } from '../googleSheets/controllers/googleSheetsController';
import { getSpreadsheetIdForUser } from '../helpers/getSpreadsheetIdForUser';

export const processExcelWDFile = async (fileBuffer: Buffer): Promise<{ savedCount: number }> => {
    
    console.log("inside processExcelFile");
    const excelNameToUserIdMap = await excelNameToUserId();
    const transactionsByInvestor: Record<string, any[]> = {};

    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const cleanedData = rawData
        .map((row: any) => {
            const userId = excelNameToUserIdMap[row['Investor']];
            if (!userId) {
                console.warn(`No userId found for Investor: ${row['Investor']}`);
                return null;
            }

            const credit = parseFloat(row['Balance']) || 0;

            if (credit === 0) return null;

            const transaction = {
                userId,
                date: new Date(),
                type: 'W/D',
                description: row['Deal Name'],
                credit,
                debit: 0,
            };

            if (!transactionsByInvestor[userId]) {
                transactionsByInvestor[userId] = [];
            }
            transactionsByInvestor[userId].push(transaction);

            return transaction;
        })
        .filter((transaction) => transaction !== null);

    const validData = cleanedData.filter(
        (transaction) =>
            transaction.userId &&
            transaction.date &&
            transaction.type &&
            transaction.description &&
            transaction.credit > 0
    );

    const sheetsController = new GoogleSheetsController();

    for (const [userId, transactions] of Object.entries(transactionsByInvestor)) {
        try {

            const spreadsheetId = await getSpreadsheetIdForUser(userId);
    
            if (!spreadsheetId) {
                console.warn(`No spreadsheet ID found for userId: ${userId}`);
                continue; 
            }
    
            const sheetData = transactions.map(transaction => [
                transaction.date.toLocaleDateString('en-US'),
                transaction.type,
                transaction.description,
                transaction.credit,
            ]);
    
            try {
                await sheetsController.uploadAndSyncTransactions(sheetData, spreadsheetId, `WD`);
                console.log(`Successfully synced transactions for userId: ${userId}`);
            } catch (syncError) {
                console.error(`Failed to sync transactions for userId: ${userId}`, syncError);
            }
        } catch (error) {
            console.error(`Error processing transactions for userId: ${userId}`, error);
        }
    }
    
    return { savedCount: validData.length };
};
