import xlsx from 'xlsx';
import { excelNameToUserId } from '../helpers/excelNameToUserId';
import { GoogleSheetsController } from '../googleSheets/controllers/googleSheetsController';
import { getSpreadsheetIdForUser } from '../helpers/getSpreadsheetIdForUser';
import downloadData from './downloadDataService';

export const processSyndicationFile = async (fileBuffer: Buffer): Promise<{ savedCount: number }> => {
    console.log("inside processSyndicationFile");
    const excelNameToUserIdMap = await excelNameToUserId();
    const transactionsByInvestor: Record<string, any[]> = {};

    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    // console.log("raw data: ");
    // console.log(rawData);

    const dealName = rawData[0]['Deal Name '] || 'Unknown Deal';

    const cleanedData = rawData
        .filter((row: any) => {
            const investorName = row[' ']?.trim();
            const investorAmount = row['__EMPTY']; // Amount is in the __EMPTY column
            const commissions = row['__EMPTY_1']; // Commissions is in the __EMPTY_1 column
            
            const isValidRow = 
                investorName && 
                typeof investorName === 'string' && 
                !investorName.includes('TOTALS') && 
                !investorName.includes('Investor Name') && 
                typeof investorAmount === 'number' &&
                typeof commissions === 'number';

            if (!isValidRow) {
                console.log("Skipping invalid row:", row);
            }

            return isValidRow;
        })
        .map((row: any) => {
            const investorName = row[' '].trim();
            const userId = excelNameToUserIdMap[investorName];
            
            if (!userId) {
                console.warn(`No userId found for Investor: ${investorName}`);
                return null;
            }

            const investorAmount = row['__EMPTY'] || 0;
            const commissionAmount = row['__EMPTY_1'] || 0;

            if (investorAmount === 0 && commissionAmount === 0) {
                console.warn(`Zero amounts for investor: ${investorName}`);
                return null;
            }

            const transactions: any[] = [];

            if (investorAmount > 0) {
                transactions.push({
                    userId,
                    date: new Date(),
                    type: 'Synd',
                    description: dealName,
                    amount: investorAmount
                });

                //console.log('downloadData before is:', JSON.stringify(downloadData.getData(), null, 2));
                downloadData.addDeal(dealName, investorName, investorAmount);
                //console.log('downloadData after is:', JSON.stringify(downloadData.getData(), null, 2));
            }

            if (commissionAmount > 0) {
                transactions.push({
                    userId,
                    date: new Date(),
                    type: 'Comm',
                    description: dealName,
                    amount: commissionAmount
                });
            }

            if (!transactionsByInvestor[userId]) {
                transactionsByInvestor[userId] = [];
            }
            transactionsByInvestor[userId].push(...transactions);

            return transactions;
        })
        .filter((transactions) => transactions !== null)
        .flat();

    //console.log("clean data size: " + cleanedData.length);

    const sheetsController = new GoogleSheetsController();

    for (const [userId, transactions] of Object.entries(transactionsByInvestor)) {
        try{    
            const spreadsheetId = await getSpreadsheetIdForUser(userId);

            if (!spreadsheetId) {
                console.warn(`No spreadsheet ID found for userId: ${userId}`);
                continue;
            }

            const sheetData = transactions.map(transaction => [
                transaction.date.toLocaleDateString('en-US'),
                transaction.type,
                transaction.description,
                transaction.amount,
            ]);

            try{
                await sheetsController.uploadAndSyncTransactions(sheetData, spreadsheetId, 'Synd');
                console.log(`Successfully synced transactions for userId: ${userId}`);
            } catch (syncError) {
                console.error(`Failed to sync transactions for userId: ${userId}`, syncError);
            }
        } catch (error) {
            console.error(`Error processing transactions for userId: ${userId}`, error);
        }
    }

    return { savedCount: cleanedData.length };
};