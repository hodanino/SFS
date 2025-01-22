"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loginController_1 = require("../controllers/loginController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.post('/register', loginController_1.register);
router.post('/login', loginController_1.login);
router.get('/profile', authMiddleware_1.default, (req, res) => {
    const user = req.user;
    res.status(200).json({ message: 'User profile data', user });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map