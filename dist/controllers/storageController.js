"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeal = exports.downloadTemporaryStorage = exports.getCurrentStorage = void 0;
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
//TODO: need to test this function and see that the csv structure is correct
const downloadTemporaryStorage = (req, res) => {
    try {
        const storage = downloadDataService_1.default.getData();
        if (!storage || Object.keys(storage).length === 0) {
            return res.status(404).json({ message: 'No data available for download.' });
        }
        const csvRows = [];
        csvRows.push('Investor Name, Merchant Name, Deal Name, Investor %, Investor Amount, Fee Collection Type, Fee1 Name, Fee1 %, Fee1 % Payback or Advance, Fee1 $, Fee1 Front End, Fee2 Name, Fee2 %, Fee2 % Payback or Advance	Fee2 $, Fee2 Front End, Fee3 Name, Fee3 %, Fee3 % Payback or Advance, Fee3 $, Fee3 Front End, Fee4 Name, Fee4 %, Fee4 % Payback or Advance, Fee4 $, Fee4 Front End');
        Object.keys(storage).forEach(dealName => {
            const investors = storage[dealName].investors;
            investors.forEach(({ investorName, investorAmount }) => {
                csvRows.push(`${investorName},${dealName},${dealName}, ,${investorAmount}`);
            });
        });
        const csvContent = csvRows.join('\n');
        res.header('Content-Type', 'text/csv');
        res.attachment('temporary_storage.csv');
        res.send(csvContent);
    }
    catch (error) {
        console.error('Error during CSV download:', error);
        res.status(500).json({ message: 'An error occurred while generating the CSV file.' });
    }
};
exports.downloadTemporaryStorage = downloadTemporaryStorage;
const deleteDeal = (req, res) => {
    try {
        const { dealName } = req.params;
        if (!dealName) {
            return res.status(400).json({ message: 'Deal name is required.' });
        }
        const storage = downloadDataService_1.default.getData();
        if (!(dealName in storage)) {
            return res.status(404).json({ message: `Deal with name "${dealName}" not found.` });
        }
        downloadDataService_1.default.deleteDeal(dealName);
        res.status(200).json({ message: `Deal "${dealName}" successfully deleted.` });
    }
    catch (error) {
        console.error('Error deleting deal:', error);
        res.status(500).json({ message: 'An error occurred while deleting the deal.' });
    }
};
exports.deleteDeal = deleteDeal;
//# sourceMappingURL=storageController.js.map