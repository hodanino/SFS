class DownloadData {

    private time: Date | null = null;
    private data: Record<string, { investors: { investorName: string; investorAmount: number }[] }> = {};

    // check and update the time field
    private updateTime() {
        const now = new Date();
        if (!this.time || now.getTime() - this.time.getTime() >= 24 * 60 * 60 * 1000) {
            this.time = now;
            this.data = {}; 
        }
    }

    // add a deal and investor data
    addDeal(dealName: string, investorName: string, investorAmount: number) {
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

    deleteDeal(dealName: string) {
        if (dealName in this.data) {
            delete this.data[dealName];
        }
    }
}

const downloadData = new DownloadData();
export default downloadData;
