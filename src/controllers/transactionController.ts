// I DONT NEED THIS FILE FOR NOW - CREATED FOR FETCHING TRANSACTIONS FOR USERS

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
    console.log("inside getTransactions");
    try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(250);

    console.log("the first tran:" + transactions[0]);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
};
