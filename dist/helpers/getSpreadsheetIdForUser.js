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
exports.getSpreadsheetIdForUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const getSpreadsheetIdForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId).select('spreadsheetId').lean();
        return (user === null || user === void 0 ? void 0 : user.spreadsheetId) || null;
    }
    catch (error) {
        console.error(`Error fetching spreadsheet ID for userId: ${userId}`, error);
        return null;
    }
});
exports.getSpreadsheetIdForUser = getSpreadsheetIdForUser;
//# sourceMappingURL=getSpreadsheetIdForUser.js.map