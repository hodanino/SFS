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
//TODO: improve this mechanism to retry specific errors 
function retryWithExponentialBackoff(operation_1) {
    return __awaiter(this, arguments, void 0, function* (operation, retries = 3, delay = 500) {
        try {
            return yield operation();
        }
        catch (error) {
            if (retries <= 0)
                throw error;
            console.log(`Retrying operation... (${retries} retries left)`);
            yield new Promise((resolve) => setTimeout(resolve, delay));
            return retryWithExponentialBackoff(operation, retries - 1, delay * 2);
        }
    });
}
//# sourceMappingURL=retryWithExponentialBackoff.js.map