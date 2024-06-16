"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateSixDigitCode() {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
}
exports.default = generateSixDigitCode;
