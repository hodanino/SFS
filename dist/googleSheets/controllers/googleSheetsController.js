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
exports.GoogleSheetsController = void 0;
const GoogleSheetsException_1 = __importDefault(require("../exceptions/GoogleSheetsException"));
const googleSheetsService_1 = require("../services/googleSheetsService");
class GoogleSheetsController {
    constructor() {
        this.googleSheetsService = new googleSheetsService_1.GoogleSheetsService();
    }
    uploadAndSyncTransactions(transactions, spreadsheetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("inside googleSheetController");
                const syncResult = yield this.googleSheetsService.syncDataToSheet(transactions, spreadsheetId);
                return {
                    message: 'Transactions processed and synced',
                    syncDetails: syncResult
                };
            }
            catch (error) {
                if (error instanceof GoogleSheetsException_1.default) {
                    console.error('Google Sheets Sync Failed', error);
                }
                throw error;
            }
        });
    }
}
exports.GoogleSheetsController = GoogleSheetsController;
//# sourceMappingURL=googleSheetsController.js.map