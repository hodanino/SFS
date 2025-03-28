import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId; 
  date: Date;
  type: 'Deposit' | 'Synd' | 'Comms' | 'W/D' | 'Transfer'; 
  description: string;
  credit: number;
  debit: number;
  comm: number;
}

const TransactionSchema: Schema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Deposit', 'Synd', 'Comms', 'W/D', 'Transfer'], required: true },
  description: { type: String, required: true },
  credit: { type: Number, default: 0 },
  debit: { type: Number, default: 0 },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
