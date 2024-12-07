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
exports.uploadExcel = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const excelNameToUserId_1 = require("../helpers/excelNameToUserId");
const updateUserTotals_1 = require("../helpers/updateUserTotals");
const Transaction_1 = __importDefault(require("../models/Transaction"));
const uploadExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const excelNameToUserIdMap = yield (0, excelNameToUserId_1.excelNameToUserId)();
        // Parse the Excel file
        const workbook = xlsx_1.default.read(req.file.buffer, { type: 'buffer' });
        console.log("parsed sheet");
        const sheetName = workbook.SheetNames[0];
        const rawData = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log("before cleaning date, raw data=  " + rawData);
        const userWDUpdates = new Map();
        const cleanedData = rawData
            .map((row) => {
            const userId = excelNameToUserIdMap[row['Investor']];
            if (!userId) {
                console.warn(`No userId found for Investor: ${row['Investor']}`);
                return null;
            }
            const credit = parseFloat(row['Balance']) || 0;
            // Increment totalWD in the map
            if (credit != 0) {
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
        // Validate cleaned data
        const validData = cleanedData.filter((transaction) => transaction.userId &&
            transaction.date &&
            transaction.type &&
            transaction.description &&
            transaction.credit > 0);
        console.log("before insertion, valid date: " + validData);
        yield Transaction_1.default.insertMany(validData);
        const updates = [];
        userWDUpdates.forEach((totalWD, userId) => {
            updates.push({
                userId,
                type: 'W/D',
                amount: totalWD,
            });
        });
        yield Promise.all(updates.map((update) => (0, updateUserTotals_1.updateUserTotals)(update)));
        res.status(200).json({ message: 'File processed successfully', savedCount: validData.length });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
});
exports.uploadExcel = uploadExcel;
//# sourceMappingURL=excelController.js.map