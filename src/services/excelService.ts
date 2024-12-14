import xlsx from 'xlsx';
import { excelNameToUserId } from '../helpers/excelNameToUserId';
import { updateUserTotals } from '../helpers/updateUserTotals';
import Transaction from '../models/Transaction';
import DataToUpdate from '../interfaces/UpdateTrans';
import { GoogleSheetsController } from '../googleSheets/controllers/googleSheetsController';
import { getSpreadsheetIdForUser } from '../helpers/getSpreadsheetIdForUser';

export const processExcelFile = async (fileBuffer: Buffer): Promise<{ savedCount: number }> => {
    const excelNameToUserIdMap = await excelNameToUserId();

    // Parse the Excel file
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const userWDUpdates = new Map<string, number>();
    const transactionsByUser: Record<string, any[]> = {};

    const cleanedData = rawData
        .map((row: any) => {
            const userId = excelNameToUserIdMap[row['Investor']];
            if (!userId) {
                console.warn(`No userId found for Investor: ${row['Investor']}`);
                return null;
            }

            const credit = parseFloat(row['Balance']) || 0;

            if (credit === 0) return null;

            userWDUpdates.set(
                userId,
                (userWDUpdates.get(userId) || 0) + credit
            );

            const transaction = {
                userId,
                date: new Date(),
                type: 'W/D',
                description: row['Deal Name'],
                credit,
                debit: 0,
            };

            if (!transactionsByUser[userId]) {
                transactionsByUser[userId] = [];
            }
            transactionsByUser[userId].push(transaction);

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

    //await Transaction.insertMany(validData);

    const updates: DataToUpdate[] = [];
    userWDUpdates.forEach((totalWD, userId) => {
        updates.push({
            userId,
            type: 'W/D',
            amount: totalWD,
        });
    });

    await Promise.all(updates.map((update) => updateUserTotals(update)));

    const sheetsController = new GoogleSheetsController();

    for (const [userId, transactions] of Object.entries(transactionsByUser)) {
        const spreadsheetId = await getSpreadsheetIdForUser(userId); 

        if (!spreadsheetId) {
            console.warn(`No spreadsheet ID found for userId: ${userId}`);
            continue;
        }

        const sheetData = transactions.map(transaction => [
            transaction.date.toISOString(),
            transaction.type,
            transaction.description,
            transaction.credit,
        ]);

        // sheetData.forEach(row => {
        //     console.log(`Date: ${row[0]}, Type: ${row[1]}, Description: ${row[2]}, Credit: ${row[3]}`);
        // });

        await sheetsController.uploadAndSyncTransactions(sheetData, spreadsheetId);
    }

    return { savedCount: validData.length };
};
