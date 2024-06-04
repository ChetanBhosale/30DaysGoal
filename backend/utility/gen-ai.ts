import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);
export const genModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
