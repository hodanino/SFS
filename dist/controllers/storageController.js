"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadTemporaryStorage = exports.getCurrentStorage = void 0;
const downloadDataService_1 = __importDefault(require("../services/downloadDataService"));
const getCurrentStorage = (req, res) => {
    try {
        const storage = downloadDataService_1.default.getData();
        if (!storage || Object.keys(storage).length === 0) {
            return res.status(404).json({ message: 'No data available in storage.' });
        }
        res.status(200).json(storage);
    }
    catch (error) {
        console.error('Error fetching current storage:', error);
        res.status(500).json({ message: 'An error occurred while retrieving storage.' });
    }
};
exports.getCurrentStorage = getCurrentStorage;
const downloadTemporaryStorage = (req, res) => {
    const storage = downloadDataService_1.default.getData();
    if (!storage || Object.keys(storage).length === 0) {
        return res.status(404).json({ message: 'No data available for download.' });
    }
    const csvRows = [];
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
exports.downloadTemporaryStorage = downloadTemporaryStorage;
//# sourceMappingURL=storageController.js.map