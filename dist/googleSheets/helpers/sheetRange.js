"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSheetData = formatSheetData;
function formatSheetData(data, fileType) {
    let range;
    let formattedData;
    if (fileType === 'WD') {
        range = `Sheet1!A:D`;
        formattedData = data; // Use data as is
    }
    else if (fileType === 'Synd') {
        range = `Sheet1!A:E`;
        formattedData = data.map(row => [
            row[0], // Column A
            row[1], // Column B
            row[2], // Column C
            '', // Placeholder for column D
            row[3], // Column E (amount goes to debit column)
        ]);
    }
    else {
        throw new Error('Unsupported file type');
    }
    return { range, formattedData };
}
//# sourceMappingURL=sheetRange.js.map