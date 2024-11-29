"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthenticationTokenMissingException extends Error {
    constructor() {
        super('Authentication token missing');
        this.status = 401;
        this.message = 'Authentication token missing';
    }
}
exports.default = AuthenticationTokenMissingException;
//# sourceMappingURL=AuthenticationTokenMissingException.js.map