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
const path_1 = __importDefault(require("path"));
const excelSyndService_1 = require("../services/excelSyndService");
const excelWDService_1 = require("../services/excelWDService");
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
        // Determine the file type
        const mimeType = req.file.mimetype;
        const extension = path_1.default.extname(req.file.originalname).toLowerCase();
        let result;
        if (mimeType === 'text/csv' || extension === '.csv') {
            console.log("sent to processCSVFile");
            result = yield (0, excelSyndService_1.processCSVFile)(req.file.buffer);
        }
        else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            mimeType === 'application/vnd.ms-excel' ||
            extension === '.xlsx' ||
            extension === '.xls') {
            console.log("sent to processExcelFile");
            result = yield (0, excelWDService_1.processExcelFile)(req.file.buffer);
        }
        else {
            res.status(400).json({ error: 'Unsupported file type' });
            return;
        }
        res.status(200).json({ message: 'File processed successfully', savedCount: result.savedCount });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
});
exports.uploadExcel = uploadExcel;
//# sourceMappingURL=excelController.js.map