import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';  // Add this import
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { uploadExcel } from './controllers/excelController';
import uploadExcelRoutes from './routes/uploadExcelRoutes';

dotenv.config();

const app: Application = express();

// Add CORS middleware before other middleware
app.use(cors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
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
app.use('/api/auth', authRoutes);
app.use('/api', transactionRoutes);
app.use('/api', uploadExcelRoutes);