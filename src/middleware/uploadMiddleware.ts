import multer from 'multer';

// configure multer to store file in memory
// might need to change for diskStorage in the future
const storage = multer.memoryStorage();
export const upload = multer({ storage });
