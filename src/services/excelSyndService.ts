// src/services/csvSyndService.ts
import csv from 'csv-parser';
import { excelNameToUserId } from '../helpers/excelNameToUserId';
import { updateUserTotals } from '../helpers/updateUserTotals';
import DataToUpdate from '../interfaces/UpdateTrans';
import { GoogleSheetsController } from '../googleSheets/controllers/googleSheetsController';
import { getSpreadsheetIdForUser } from '../helpers/getSpreadsheetIdForUser';

export const processCSVFile = async (fileBuffer: Buffer): Promise<{ savedCount: number }> => {
    
    console.log("inside processCSVFile");
    const excelNameToUserIdMap = await excelNameToUserId();
    const userSyndUpdates = new Map<string, number>();
    const transactionsByInvestor: Record<string, any[]> = {};

    // Parse CSV
    const parsedData = await new Promise<any[]>((resolve, reject) => {
        const results: any[] = [];
        const bufferStream = new (require('stream').Readable)();
        bufferStream.push(fileBuffer);
        bufferStream.push(null);

        bufferStream
            .pipe(csv())
            .on('data', (data) => results.push({
                investorName: data['Investor Name']?.trim() || '',
                dealName: data['Deal Name']?.trim() || '',
                amount: parseFloat(data['Investor Amount']?.replace(/[,$]/g, '') || '0')
            }))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });

    const cleanedData = parsedData
        .map((row: any) => {
            const userId = excelNameToUserIdMap[row.investorName];
            if (!userId) {
                console.warn(`No userId found for Investor: ${row.investorName}`);
                return null;
            }

            const amount = row.amount || 0;

            if (amount === 0) return null;

            userSyndUpdates.set(
                userId,
                (userSyndUpdates.get(userId) || 0) + amount
            );

            const transaction = {
                userId,
                date: new Date(),
                type: 'Synd',
                description: row.dealName,
                credit: 0,
                debit: amount,
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
            transaction.debit > 0
    );

    const updates: DataToUpdate[] = [];
    userSyndUpdates.forEach((totalAmount, userId) => {
        updates.push({
            userId,
            type: 'Synd',
            amount: totalAmount,
        });
    });

    await Promise.all(updates.map((update) => updateUserTotals(update)));

    const sheetsController = new GoogleSheetsController();

    for (const [userId, transactions] of Object.entries(transactionsByInvestor)) {
        const spreadsheetId = await getSpreadsheetIdForUser(userId);

        if (!spreadsheetId) {
            console.warn(`No spreadsheet ID found for userId: ${userId}`);
            continue;
        }

        const sheetData = transactions.map(transaction => [
            transaction.date.toISOString(),
            transaction.type,
            transaction.description,
            transaction.debit,
        ]);

        await sheetsController.uploadAndSyncTransactions(sheetData, spreadsheetId, `Synd`);
    }

    return { savedCount: validData.length };
};