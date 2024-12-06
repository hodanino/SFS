import { Request } from 'express';
import { Multer } from 'multer';

declare global {
    namespace Express {
      interface Request {
        user?: {
          id: string;
          role?: string;
        };
        file?: Multer.File;
      }
    }
  }
  
  export {};