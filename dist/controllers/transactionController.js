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
exports.getTransactions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inside getTransactions");
    try {
        const { userId } = req.params;
        // Validate userId
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
        // Fetch latest 500 transactions
        const transactions = yield Transaction_1.default.find({ userId })
            .sort({ date: -1 })
            .limit(500);
        console.log("the first tran:" + transactions[0]);
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
    }
});
exports.getTransactions = getTransactions;
//# sourceMappingURL=transactionController.js.map