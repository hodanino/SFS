"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const excelController_1 = require("../controllers/excelController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
router.post('/upload-excel', authMiddleware_1.default, uploadMiddleware_1.upload.single('file'), excelController_1.uploadExcel);
exports.default = router;
//# sourceMappingURL=uploadExcelRoutes.js.map