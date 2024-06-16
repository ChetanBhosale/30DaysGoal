"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genModel = void 0;
const generative_ai_1 = require("@google/generative-ai");
require("dotenv/config");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API);
exports.genModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
