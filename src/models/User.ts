import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  excelName: string;
  role: 'admin' | 'investor';
  accountBalance: number;
  totalCredit: number;
  totalDebit: number;
  totalSynd: number;
  totalComms: number;
  totalWD: number;
  totalDeposits: number;
  totalDeals: number;
  totalPayouts: number;
  totalTransfers: number;
  spreadsheetId: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  excelName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'investor'], default: 'investor' },
  accountBalance: { type: Number, default: 0 },
  totalCredit: { type: Number, default: 0 },
  totalDebit: { type: Number, default: 0 },
  totalSynd: { type: Number, default: 0 },
  totalComms: { type: Number, default: 0 },
  totalWD: { type: Number, default: 0 },
  totalDeposits: { type: Number, default: 0 },
  totalDeals: { type: Number, default: 0 },
  totalPayouts: { type: Number, default: 0 },
  totalTransfers: { type: Number, default: 0 },
  spreadsheetId: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);
