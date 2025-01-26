export function formatSheetData(data: any[], fileType: 'WD' | 'Synd') {
    
    let range: string;
    let formattedData: any[][];
  
    if (fileType === 'WD') {
      range = `Sheet1!A:D`;
      formattedData = data; 
    } else if (fileType === 'Synd') {
      range = `Sheet1!A:E`;
      formattedData = data.map(row => [
        row[0], 
        row[1], 
        row[2], 
        '',     
        row[3], 
      ]);
    } else {
      throw new Error('Unsupported file type');
    }
  
    return { range, formattedData };
  }
  