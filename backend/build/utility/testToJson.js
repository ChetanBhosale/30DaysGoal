"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function textToJson(text) {
    text = text.trim();
    text = text.replace(/^```json\n/, "").replace(/```$/, "");
    const jsonData = JSON.parse(text);
    return jsonData;
}
exports.default = textToJson;
