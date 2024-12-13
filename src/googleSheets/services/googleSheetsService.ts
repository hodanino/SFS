import { google, sheets_v4 } from 'googleapis';
import { GoogleSheetsConfigManager } from '../config/googleSheetsConfig';
import GoogleSheetsException from '../exceptions/GoogleSheetsException';

export class GoogleSheetsService {
    appendDataToSheet(sheetData: any[][]) {
        throw new Error('Method not implemented.');
    }
  private sheetsClient: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor() {
    const config = GoogleSheetsConfigManager.getInstance();
    const auth = config.createAuthClient();
    this.sheetsClient = google.sheets({ version: 'v4', auth });
    this.spreadsheetId = config.config.spreadsheetId;
  }

  async syncDataToSheet(data: any[], sheetName: string = 'Sheet1') {
    try {
      if (!data || data.length === 0) {
        throw new GoogleSheetsException('No data to sync');
      }

      const response = await this.sheetsClient.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:D`, 
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: data
        }
      });

      console.log(`Successfully synced ${data.length} rows`);
      return {
        updatedRows: response.data.updates?.updatedRows || 0,
        success: true
      };
    } catch (error) {
      console.error('Google Sheets Sync Error:', error);
      
      if (error instanceof GoogleSheetsException) {
        throw error;
      }

      throw new GoogleSheetsException(
        error instanceof Error ? error.message : 'Unknown Google Sheets sync error'
      );
    }
  }

  // Optional: Method to read existing data
  /*
  async readSheetData(range: string = 'Sheet1!A:Z') {
    try {
      const response = await this.sheetsClient.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range
      });

      return response.data.values || [];
    } catch (error) {
      throw new GoogleSheetsException('Failed to read sheet data');
    }
  }
  */
}