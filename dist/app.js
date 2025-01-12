"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const uploadExcelRoutes_1 = __importDefault(require("./routes/uploadExcelRoutes"));
const uploadedDealsStorageRoutes_1 = __importDefault(require("./routes/uploadedDealsStorageRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Add CORS middleware before other middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
// MongoDB connection
mongoose_1.default
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test')
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('Database connection error:', err);
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api', transactionRoutes_1.default);
app.use('/api', uploadExcelRoutes_1.default);
app.use('/api/storage', uploadedDealsStorageRoutes_1.default);
//# sourceMappingURL=app.js.map