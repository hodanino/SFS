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
exports.processExcelFile = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const excelNameToUserId_1 = require("../helpers/excelNameToUserId");
const googleSheetsController_1 = require("../googleSheets/controllers/googleSheetsController");
const getSpreadsheetIdForUser_1 = require("../helpers/getSpreadsheetIdForUser");
const processExcelFile = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inside processExcelFile");
    const excelNameToUserIdMap = yield (0, excelNameToUserId_1.excelNameToUserId)();
    const transactionsByInvestor = {};
    const workbook = xlsx_1.default.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const cleanedData = rawData
        .map((row) => {
        const userId = excelNameToUserIdMap[row['Investor']];
        if (!userId) {
            console.warn(`No userId found for Investor: ${row['Investor']}`);
            return null;
        }
        const credit = parseFloat(row['Balance']) || 0;
        if (credit === 0)
            return null;
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
    const validData = cleanedData.filter((transaction) => transaction.userId &&
        transaction.date &&
        transaction.type &&
        transaction.description &&
        transaction.credit > 0);
    const sheetsController = new googleSheetsController_1.GoogleSheetsController();
    for (const [userId, transactions] of Object.entries(transactionsByInvestor)) {
        try {
            const spreadsheetId = yield (0, getSpreadsheetIdForUser_1.getSpreadsheetIdForUser)(userId);
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
                yield sheetsController.uploadAndSyncTransactions(sheetData, spreadsheetId, `WD`);
                console.log(`Successfully synced transactions for userId: ${userId}`);
            }
            catch (syncError) {
                console.error(`Failed to sync transactions for userId: ${userId}`, syncError);
            }
        }
        catch (error) {
            console.error(`Error processing transactions for userId: ${userId}`, error);
        }
    }
    return { savedCount: validData.length };
});
exports.processExcelFile = processExcelFile;
//# sourceMappingURL=excelWDService.js.map