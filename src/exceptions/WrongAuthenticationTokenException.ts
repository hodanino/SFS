class WrongAuthenticationTokenException extends Error {
    status: number;
    message: string;
  
    constructor() {
      super('Invalid authentication token');
      this.status = 401;
      this.message = 'Invalid authentication token';
    }
  }
  
  export default WrongAuthenticationTokenException;