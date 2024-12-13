import DataToUpdate from "../interfaces/UpdateTrans";
import User from "../models/User";

export const updateUserTotals = async (transaction: DataToUpdate): Promise<void> => {
    const { userId, type, amount } = transaction;
  
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    switch (type) {
      case 'Synd':
        user.totalSynd += amount;
        user.totalDebit += amount;
        user.totalDeals += 1;
        break;
      case 'Comms':
        user.totalComms += amount;
        user.totalDebit += amount;
        break;
      case 'W/D':
        user.totalWD += amount;
        user.totalCredit += amount;
        break;
      case 'Deposit':
        user.totalDeposits += amount;
        user.totalCredit += amount;
        break;
      case 'Payout':
        user.totalPayouts += amount;
        user.totalDebit += amount;
        user.totalTransfers += amount;
        break;
      default:
        throw new Error(`Unsupported transaction type: ${type}`);
    }

    user.accountBalance = user.totalCredit - user.totalDebit;
  
    await user.save();
  };