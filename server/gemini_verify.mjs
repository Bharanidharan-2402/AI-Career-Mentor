import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
console.log('GEMINI_MODEL used:', process.env.GEMINI_MODEL);
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);
const model = ai.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
const result = await model.generateContent('Please confirm that this Gemini API key and model configuration is working with a short sentence.');
console.log('Result type:', typeof result);
console.log('Response text:', result.response?.text ? result.response.text() : JSON.stringify(result));