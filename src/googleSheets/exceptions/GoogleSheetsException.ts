class GoogleSheetsException extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = "GoogleSheetsException"; 
    this.status = 500; 
    Object.setPrototypeOf(this, GoogleSheetsException.prototype); 
  }
}

export default GoogleSheetsException;
