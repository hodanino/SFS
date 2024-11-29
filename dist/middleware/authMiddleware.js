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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthenticationTokenMissingException_1 = __importDefault(require("../exceptions/AuthenticationTokenMissingException"));
const WrongAuthenticationTokenException_1 = __importDefault(require("../exceptions/WrongAuthenticationTokenException"));
const User_1 = __importDefault(require("../models/User"));
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return next(new AuthenticationTokenMissingException_1.default());
        }
        const token = authHeader.split(' ')[1];
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('JWT_SECRET is not defined');
            }
            const verificationResponse = jsonwebtoken_1.default.verify(token, secret);
            const userId = verificationResponse.id;
            const user = yield User_1.default.findById(userId);
            if (!user) {
                return next(new WrongAuthenticationTokenException_1.default());
            }
            req.user = {
                id: userId,
                // Add other user properties if needed
            };
            next();
        }
        catch (error) {
            next(new WrongAuthenticationTokenException_1.default());
        }
    });
}
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map