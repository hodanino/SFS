import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  excelName: string;
  role: 'admin' | 'investor';
  spreadsheetId: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  excelName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'investor'], default: 'investor' },
  spreadsheetId: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);
