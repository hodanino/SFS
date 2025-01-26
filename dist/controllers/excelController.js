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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadExcel = void 0;
const excelSyndCommService_1 = require("../services/excelSyndCommService");
const excelWDService_1 = require("../services/excelWDService");
const uploadExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const originalName = req.file.originalname;
        //TODO: check if not starts with 'Synd' it should start with 'syndication' - else throw exs
        const isSyndicationFile = originalName.startsWith('Synd ');
        let result;
        if (isSyndicationFile) {
            result = yield (0, excelSyndCommService_1.processSyndicationFile)(req.file.buffer);
            res.status(200).json({
                message: 'Syndication file processed successfully',
                fileName: originalName,
                savedCount: result.savedCount,
                type: 'syndication'
            });
        }
        else {
            result = yield (0, excelWDService_1.processExcelFile)(req.file.buffer);
            res.status(200).json({
                message: 'W/D file processed successfully',
                fileName: originalName,
                savedCount: result.savedCount,
                type: 'withdrawal'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: 'Failed to process file',
            details: error.message,
            filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname // Include filename in error for debugging
        });
    }
});
exports.uploadExcel = uploadExcel;
//# sourceMappingURL=excelController.js.map