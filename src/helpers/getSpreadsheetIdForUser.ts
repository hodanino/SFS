import User from '../models/User'; // Replace with the path to your User model

export const getSpreadsheetIdForUser = async (userId: string): Promise<string | null> => {
    try {
        const user = await User.findById(userId).select('spreadsheetId').lean();
        return user?.spreadsheetId || null;
    } catch (error) {
        console.error(`Error fetching spreadsheet ID for userId: ${userId}`, error);
        return null;
    }
};
