class DownloadData {
    
    private time: Date | null = null;
    private data: Record<string, { investors: { investorName: string; investorAmount: number }[] }> = {};

    // Method to check and update the time field
    private updateTime() {
        const now = new Date();
        if (!this.time || now.getTime() - this.time.getTime() >= 24 * 60 * 60 * 1000) {
            this.time = now;
            this.data = {}; 
        }
    }

    // Method to add a deal and investor data
    addDeal(dealName: string, investorName: string, investorAmount: number) {
        this.updateTime(); 

        if (!this.data[dealName]) {
            this.data[dealName] = { investors: [] };
        }

        this.data[dealName].investors.push({ investorName, investorAmount });
    }

    // Method to retrieve the data for CSV download
    getData() {
        return this.data;
    }
}

const downloadData = new DownloadData();
export default downloadData;
