class DownloadData {

    private time: Date | null = null;
    private data: Record<string, { investors: { investorName: string; investorAmount: number }[] }> = {};

    private updateTime() {
        const now = new Date();
        if (!this.time || now.getTime() - this.time.getTime() >= 24 * 60 * 60 * 1000) {
            this.time = now;
            this.data = {}; 
        }
    }

    addDeal(dealName: string, investorName: string, investorAmount: number) {
        this.updateTime(); 

        if (!this.data[dealName]) {
            this.data[dealName] = { investors: [] };
        }

        this.data[dealName].investors.push({ investorName, investorAmount });
    }

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
