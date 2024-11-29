"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = (0, express_1.Router)();
// Get transactions for a specific user
router.get('/transactions/:userId', authMiddleware_1.default, transactionController_1.getTransactions);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map