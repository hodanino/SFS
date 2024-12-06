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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inside register");
    const { name, email, password, excelName, role } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({ name, email, password: hashedPassword, excelName, role });
        yield newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'Error creating user' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inside login");
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        console.log("create an JWT");
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.login = login;
//# sourceMappingURL=authController.js.map