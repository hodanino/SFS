"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DownloadData {
    constructor() {
        this.time = null;
        this.data = {};
    }
    // check and update the time field
    updateTime() {
        const now = new Date();
        if (!this.time || now.getTime() - this.time.getTime() >= 24 * 60 * 60 * 1000) {
            this.time = now;
            this.data = {};
        }
    }
    // add a deal and investor data
    addDeal(dealName, investorName, investorAmount) {
        this.updateTime();
        if (!this.data[dealName]) {
            this.data[dealName] = { investors: [] };
        }
        this.data[dealName].investors.push({ investorName, investorAmount });
    }
    // retrieve the data for CSV download
    getData() {
        return this.data;
    }
    deleteDeal(dealName) {
        if (dealName in this.data) {
            delete this.data[dealName];
        }
    }
}
const downloadData = new DownloadData();
exports.default = downloadData;
//# sourceMappingURL=downloadDataService.js.map