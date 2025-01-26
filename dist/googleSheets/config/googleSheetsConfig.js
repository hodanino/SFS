"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsConfigManager = void 0;
const googleapis_common_1 = require("googleapis-common");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class GoogleSheetsConfigManager {
    constructor() {
        var _a;
        const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
        const privateKey = (_a = process.env.GOOGLE_SHEETS_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n');
        if (!clientEmail || !privateKey) {
            throw new Error('Missing Google Sheets configuration');
        }
        this.config = {
            clientEmail,
            privateKey,
        };
    }
    static getInstance() {
        if (!GoogleSheetsConfigManager.instance) {
            GoogleSheetsConfigManager.instance = new GoogleSheetsConfigManager();
        }
        return GoogleSheetsConfigManager.instance;
    }
    createAuthClient() {
        return new googleapis_common_1.GoogleAuth({
            credentials: {
                client_email: this.config.clientEmail,
                private_key: this.config.privateKey
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
    }
}
exports.GoogleSheetsConfigManager = GoogleSheetsConfigManager;
//# sourceMappingURL=googleSheetsConfig.js.map