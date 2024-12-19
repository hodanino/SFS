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
exports.processCSVFile = void 0;
// src/services/csvSyndService.ts
const csv_parser_1 = __importDefault(require("csv-parser"));
const excelNameToUserId_1 = require("../helpers/excelNameToUserId");
const updateUserTotals_1 = require("../helpers/updateUserTotals");
const googleSheetsController_1 = require("../googleSheets/controllers/googleSheetsController");
const getSpreadsheetIdForUser_1 = require("../helpers/getSpreadsheetIdForUser");
const processCSVFile = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inside processCSVFile");
    const excelNameToUserIdMap = yield (0, excelNameToUserId_1.excelNameToUserId)();
    const userSyndUpdates = new Map();
    const transactionsByInvestor = {};
    // Parse CSV
    const parsedData = yield new Promise((resolve, reject) => {
        const results = [];
        const bufferStream = new (require('stream').Readable)();
        bufferStream.push(fileBuffer);
        bufferStream.push(null);
        bufferStream
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => {
            var _a, _b, _c;
            return results.push({
                investorName: ((_a = data['Investor Name']) === null || _a === void 0 ? void 0 : _a.trim()) || '',
                dealName: ((_b = data['Deal Name']) === null || _b === void 0 ? void 0 : _b.trim()) || '',
                amount: parseFloat(((_c = data['Investor Amount']) === null || _c === void 0 ? void 0 : _c.replace(/[,$]/g, '')) || '0')
            });
        })
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
    const cleanedData = parsedData
        .map((row) => {
        const userId = excelNameToUserIdMap[row.investorName];
        if (!userId) {
            console.warn(`No userId found for Investor: ${row.investorName}`);
            return null;
        }
        const amount = row.amount || 0;
        if (amount === 0)
            return null;
        userSyndUpdates.set(userId, (userSyndUpdates.get(userId) || 0) + amount);
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
    const validData = cleanedData.filter((transaction) => transaction.userId &&
        transaction.date &&
        transaction.type &&
        transaction.description &&
        transaction.debit > 0);
    const updates = [];
    userSyndUpdates.forEach((totalAmount, userId) => {
        updates.push({
            userId,
            type: 'Synd',
            amount: totalAmount,
        });
    });
    yield Promise.all(updates.map((update) => (0, updateUserTotals_1.updateUserTotals)(update)));
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
            transaction.debit,
        ]);
        yield sheetsController.uploadAndSyncTransactions(sheetData, spreadsheetId, `Synd`);
    }
    return { savedCount: validData.length };
});
exports.processCSVFile = processCSVFile;
//# sourceMappingURL=excelSyndService.js.map