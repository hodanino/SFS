import { GoogleAuth } from 'googleapis-common';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { GoogleSheetsConfig } from '../interfaces/GoogleSheetConfig';

dotenv.config();

export class GoogleSheetsConfigManager {
  private static instance: GoogleSheetsConfigManager;
  public config: GoogleSheetsConfig;

  private constructor() {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey ) {
      throw new Error('Missing Google Sheets configuration');
    }

    this.config = {
      clientEmail,
      privateKey,
    };
  }

  public static getInstance(): GoogleSheetsConfigManager {
    if (!GoogleSheetsConfigManager.instance) {
      GoogleSheetsConfigManager.instance = new GoogleSheetsConfigManager();
    }
    return GoogleSheetsConfigManager.instance;
  }

  public createAuthClient(): GoogleAuth {
    return new GoogleAuth({
      credentials: {
        client_email: this.config.clientEmail,
        private_key: this.config.privateKey
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
  }
}