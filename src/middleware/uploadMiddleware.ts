import multer from 'multer';

// Configure multer to store file in memory
const storage = multer.memoryStorage();
export const upload = multer({ storage });
