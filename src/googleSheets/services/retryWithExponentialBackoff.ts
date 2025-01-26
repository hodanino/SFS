//TODO: improve this mechanism to retry specific errors 
export async function retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,  
    retries: number = 3,         
    delay: number = 500          
  ): Promise<T> {
    try {
      return await operation();  
    } catch (error) {
      if (retries <= 0) throw error;  
  
      console.log(`Retrying operation... (${retries} retries left)`);
  
      await new Promise((resolve) => setTimeout(resolve, delay));
  
      return retryWithExponentialBackoff(operation, retries - 1, delay * 2);
    }
  }
  