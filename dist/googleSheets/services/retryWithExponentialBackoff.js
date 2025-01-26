"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryWithExponentialBackoff = retryWithExponentialBackoff;
function retryWithExponentialBackoff(operation_1) {
    return __awaiter(this, arguments, void 0, function* (operation, // Function to retry
    retries = 3, // Number of retries
    delay = 500 // Initial delay (in ms)
    ) {
        try {
            return yield operation(); // Try the operation
        }
        catch (error) {
            if (retries <= 0)
                throw error; // No more retries left, throw the error
            console.log(`Retrying operation... (${retries} retries left)`);
            // Wait for 'delay' ms before retrying
            yield new Promise((resolve) => setTimeout(resolve, delay));
            // Retry with exponential backoff (double the delay each time)
            return retryWithExponentialBackoff(operation, retries - 1, delay * 2);
        }
    });
}
//# sourceMappingURL=retryWithExponentialBackoff.js.map