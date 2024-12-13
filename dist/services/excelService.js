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
const processExcelFile = (fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const excelNameToUserIdMap = yield (0, excelNameToUserId_1.excelNameToUserId)();
    // Parse the Excel file
    const workbook = xlsx_1.default.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const userWDUpdates = new Map();
    const cleanedData = rawData
        .map((row) => {
        const userId = excelNameToUserIdMap[row['Investor']];
        if (!userId) {
            console.warn(`No userId found for Investor: ${row['Investor']}`);
            return null;
        }
        const credit = parseFloat(row['Balance']) || 0;
        if (credit !== 0) {
            userWDUpdates.set(userId, (userWDUpdates.get(userId) || 0) + credit);
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
    const validData = cleanedData.filter((transaction) => transaction.userId &&
        transaction.date &&
        transaction.type &&
        transaction.description &&
        transaction.credit > 0);
    //await Transaction.insertMany(validData);
    const updates = [];
    userWDUpdates.forEach((totalWD, userId) => {
        updates.push({
            userId,
            type: 'W/D',
            amount: totalWD,
        });
    });
    //await Promise.all(updates.map((update) => updateUserTotals(update)));
    const sheetsController = new googleSheetsController_1.GoogleSheetsController();
    const sheetData = validData.map(transaction => [
        transaction.date.toISOString(),
        transaction.type,
        transaction.description,
        transaction.credit
    ]);
    sheetData.forEach(row => {
        console.log(`Date: ${row[0]}, Type: ${row[1]}, Description: ${row[2]}, Credit: ${row[3]}`);
    });
    yield sheetsController.uploadAndSyncTransactions(sheetData);
    return { savedCount: validData.length };
});
exports.processExcelFile = processExcelFile;
//# sourceMappingURL=excelService.js.map