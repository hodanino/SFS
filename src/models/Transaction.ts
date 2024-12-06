import mongoose, { Schema, Document } from 'mongoose';

// Define the Transaction interface
export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user
  date: Date;
  type: 'Deposit' | 'Synd' | 'Comms' | 'W/D' | 'Transfer'; // Use enums for consistency
  description: string;
  credit: number;
  debit: number;
  comm: number;
}

// Define the Transaction schema
const TransactionSchema: Schema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Deposit', 'Synd', 'Comms', 'W/D', 'Transfer'], required: true },
  description: { type: String, required: true },
  credit: { type: Number, default: 0 },
  debit: { type: Number, default: 0 },
});

// Create the Transaction model
export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
