"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WrongAuthenticationTokenException extends Error {
    constructor() {
        super('Invalid authentication token');
        this.status = 401;
        this.message = 'Invalid authentication token';
    }
}
exports.default = WrongAuthenticationTokenException;
//# sourceMappingURL=WrongAuthenticationTokenException.js.map