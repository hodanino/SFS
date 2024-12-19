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
exports.GoogleSheetsService = void 0;
const googleapis_1 = require("googleapis");
const googleSheetsConfig_1 = require("../config/googleSheetsConfig");
const GoogleSheetsException_1 = __importDefault(require("../exceptions/GoogleSheetsException"));
const sheetRange_1 = require("../helpers/sheetRange");
class GoogleSheetsService {
    constructor() {
        console.log("inside service controller");
        const config = googleSheetsConfig_1.GoogleSheetsConfigManager.getInstance();
        const auth = config.createAuthClient();
        this.sheetsClient = googleapis_1.google.sheets({ version: 'v4', auth });
    }
    syncDataToSheet(data, spreadsheetId, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.spreadsheetId = spreadsheetId;
            try {
                if (!data || data.length === 0) {
                    throw new GoogleSheetsException_1.default('No data to sync');
                }
                // console.log("Attempting to sync data to Google Sheets...");
                console.log("Spreadsheet ID:", this.spreadsheetId);
                // console.log("Data to sync:", data);
                const { range, formattedData } = (0, sheetRange_1.formatSheetData)(data, fileType);
                const response = yield this.sheetsClient.spreadsheets.values.append({
                    spreadsheetId: this.spreadsheetId,
                    range,
                    valueInputOption: 'RAW',
                    insertDataOption: 'INSERT_ROWS',
                    requestBody: {
                        values: formattedData
                    }
                });
                console.log(`Successfully synced ${data.length} rows`);
                return {
                    updatedRows: ((_a = response.data.updates) === null || _a === void 0 ? void 0 : _a.updatedRows) || 0,
                    success: true
                };
            }
            catch (error) {
                console.error('Google Sheets Sync Error:', error);
                if (error instanceof GoogleSheetsException_1.default) {
                    throw error;
                }
                throw new GoogleSheetsException_1.default(error instanceof Error ? error.message : 'Unknown Google Sheets sync error');
            }
        });
    }
}
exports.GoogleSheetsService = GoogleSheetsService;
//# sourceMappingURL=googleSheetsService.js.map