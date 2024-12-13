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
class GoogleSheetsService {
    appendDataToSheet(sheetData) {
        throw new Error('Method not implemented.');
    }
    constructor() {
        const config = googleSheetsConfig_1.GoogleSheetsConfigManager.getInstance();
        const auth = config.createAuthClient();
        this.sheetsClient = googleapis_1.google.sheets({ version: 'v4', auth });
        this.spreadsheetId = config.config.spreadsheetId;
    }
    // Transform validData to match the desired column order
    transformData(data) {
        return data.map((item) => [
            item.Date, // Column A: Date
            item.Type, // Column B: Type
            item.Description, // Column C: Description
            item.Credit, // Column D: Credit
        ]);
    }
    // Main method to sync data to Google Sheets
    syncDataToSheet(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, sheetName = 'Sheet1') {
            var _a;
            try {
                // 1. Validate input
                if (!data || data.length === 0) {
                    throw new GoogleSheetsException_1.default('No data to sync');
                }
                // 2. Transform data
                //const transformedData = this.transformData(data);
                const transformedData = data;
                // 3. Append data to sheet
                const response = yield this.sheetsClient.spreadsheets.values.append({
                    spreadsheetId: this.spreadsheetId,
                    range: `${sheetName}!A:D`, // Adjust range as needed
                    valueInputOption: 'RAW',
                    insertDataOption: 'INSERT_ROWS',
                    requestBody: {
                        values: transformedData
                    }
                });
                // 4. Log and return result
                console.log(`Successfully synced ${transformedData.length} rows`);
                return {
                    updatedRows: ((_a = response.data.updates) === null || _a === void 0 ? void 0 : _a.updatedRows) || 0,
                    success: true
                };
            }
            catch (error) {
                // 5. Comprehensive error handling
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