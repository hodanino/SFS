import { Types } from "mongoose";

export default interface DataToUpdate {
    userId: Types.ObjectId | string; 
    type: 'Synd' | 'Comms' | 'W/D' | 'Deposit' | 'Payout';
    amount: number; 
  }