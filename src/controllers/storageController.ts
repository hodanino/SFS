import { Request, Response } from 'express';
import downloadData from '../services/downloadDataService';
import downloadDataService from '../services/downloadDataService';

//TODO: need to test this function more - it worked the last time but not consistently
export const getCurrentStorage = (req: Request, res: Response) => {
    try {
        const storage = downloadData.getData();

        if (!storage || Object.keys(storage).length === 0) {
            return res.status(404).json({ message: 'No data available in storage.' });
        }

        res.status(200).json(storage);
    } catch (error) {
        console.error('Error fetching current storage:', error);
        res.status(500).json({ message: 'An error occurred while retrieving storage.' });
    }
};

//TODO: need to test this function and see that the csv structure is correct
export const downloadTemporaryStorage = (req: Request, res: Response) => {
    const storage = downloadData.getData();

    if (!storage || Object.keys(storage).length === 0) {
        return res.status(404).json({ message: 'No data available for download.' });
    }

    const csvRows: string[] = [];
    csvRows.push('Deal Name,Investor Name,Amount');

    Object.keys(storage).forEach(dealName => {
        const investors = storage[dealName].investors;
        investors.forEach(({ investorName, investorAmount }) => {
            csvRows.push(`${dealName},${investorName},${investorAmount}`);
        });
    });

    const csvContent = csvRows.join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('temporary_storage.csv');
    res.send(csvContent);
};