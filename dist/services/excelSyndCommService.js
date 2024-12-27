"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSyndicationFile = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const excelNameToUserId_1 = require("../helpers/excelNameToUserId");
const googleSheetsController_1 = require("../googleSheets/controllers/googleSheetsController");
const getSpreadsheetIdForUser_1 = require("../helpers/getSpreadsheetIdForUser");
const processSyndicationFile = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inside processSyndicationFile");
    const excelNameToUserIdMap = yield (0, excelNameToUserId_1.excelNameToUserId)();
    const transactionsByInvestor = {};
    const workbook = xlsx_1.default.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log("raw data: ");
    console.log(rawData);
    const dealName = rawData[0]['Deal Name '] || 'Unknown Deal';
    const cleanedData = rawData
        .filter((row) => {
        var _a;
        // Check if this is a valid investor row by looking for the investor name in the ' ' column
        const investorName = (_a = row[' ']) === null || _a === void 0 ? void 0 : _a.trim();
        const investorAmount = row['__EMPTY']; // Amount is in the __EMPTY column
        const commissions = row['__EMPTY_1']; // Commissions is in the __EMPTY_1 column
        const isValidRow = investorName &&
            typeof investorName === 'string' &&
            !investorName.includes('TOTALS') && // Skip totals row
            !investorName.includes('Investor Name') && // Skip header row
            typeof investorAmount === 'number' &&
            typeof commissions === 'number';
        if (!isValidRow) {
            console.log("Skipping invalid row:", row);
        }
        return isValidRow;
    })
        .map((row) => {
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
        const transactions = [];
        if (investorAmount > 0) {
            transactions.push({
                userId,
                date: new Date(),
                type: 'Synd',
                description: dealName,
                amount: investorAmount
            });
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
    console.log("clean data size: " + cleanedData.length);
    const sheetsController = new googleSheetsController_1.GoogleSheetsController();
    for (const [userId, transactions] of Object.entries(transactionsByInvestor)) {
        const spreadsheetId = yield (0, getSpreadsheetIdForUser_1.getSpreadsheetIdForUser)(userId);
        if (!spreadsheetId) {
            console.warn(`No spreadsheet ID found for userId: ${userId}`);
            continue;
        }
        const sheetData = transactions.map(transaction => [
            transaction.date.toISOString(),
            transaction.type,
            transaction.description,
            transaction.amount,
        ]);
        sheetData.forEach(row => {
            console.log(`Date: ${row[0]}, Type: ${row[1]}, Description: ${row[2]}, Credit: ${row[3]}`);
        });
        yield sheetsController.uploadAndSyncTransactions(sheetData, spreadsheetId, 'Synd');
    }
    return { savedCount: cleanedData.length };
});
exports.processSyndicationFile = processSyndicationFile;
//# sourceMappingURL=excelSyndCommService.js.map