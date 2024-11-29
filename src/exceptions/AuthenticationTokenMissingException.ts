class AuthenticationTokenMissingException extends Error {
    status: number;
    message: string;
  
    constructor() {
      super('Authentication token missing');
      this.status = 401;
      this.message = 'Authentication token missing';
    }
  }
  
  export default AuthenticationTokenMissingException;
  
  