"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GoogleSheetsException extends Error {
    constructor(message) {
        super(message);
        this.name = "GoogleSheetsException";
        this.status = 500;
        Object.setPrototypeOf(this, GoogleSheetsException.prototype);
    }
}
exports.default = GoogleSheetsException;
//# sourceMappingURL=GoogleSheetsException.js.map