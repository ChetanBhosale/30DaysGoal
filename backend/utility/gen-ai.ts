import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

console.log(process.env.GEMINI_API!);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
