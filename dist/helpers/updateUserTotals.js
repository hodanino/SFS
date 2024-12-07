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
exports.updateUserTotals = void 0;
const User_1 = __importDefault(require("../models/User"));
const updateUserTotals = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, type, amount } = transaction;
    const user = yield User_1.default.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    switch (type) {
        case 'Synd':
            user.totalSynd += amount;
            user.totalDebit += amount;
            user.totalDeals += 1;
            break;
        case 'Comms':
            user.totalComms += amount;
            user.totalDebit += amount;
            break;
        case 'W/D':
            user.totalWD += amount;
            user.totalCredit += amount;
            break;
        case 'Deposit':
            user.totalDeposits += amount;
            user.totalCredit += amount;
            break;
        case 'Payout':
            user.totalPayouts += amount;
            user.totalDebit += amount;
            user.totalTransfers += amount;
            break;
        default:
            throw new Error(`Unsupported transaction type: ${type}`);
    }
    user.accountBalance = user.totalCredit - user.totalDebit;
    yield user.save();
});
exports.updateUserTotals = updateUserTotals;
//# sourceMappingURL=updateUserTotals.js.map