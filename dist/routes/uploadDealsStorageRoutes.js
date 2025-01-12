"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storageController_1 = require("../controllers/storageController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
router.get('/download-storage', authMiddleware_1.default, storageController_1.downloadTemporaryStorage);
router.get('/get-storage', authMiddleware_1.default, storageController_1.getCurrentStorage);
exports.default = router;
//# sourceMappingURL=uploadDealsStorageRoutes.js.map