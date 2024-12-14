import GoogleSheetsException from '../exceptions/GoogleSheetsException';
import { GoogleSheetsService } from '../services/googleSheetsService';

export class GoogleSheetsController {
  private googleSheetsService = new GoogleSheetsService();

  async uploadAndSyncTransactions(transactions: any[], spreadsheetId: string) {
    try {
      console.log("inside googleSheetController");
      const syncResult = await this.googleSheetsService.syncDataToSheet(transactions, spreadsheetId);
      
      return {
        message: 'Transactions processed and synced',
        syncDetails: syncResult
      };
    } catch (error) {
      if (error instanceof GoogleSheetsException) {
        console.error('Google Sheets Sync Failed', error);
      }
      throw error;
    }
  }
}