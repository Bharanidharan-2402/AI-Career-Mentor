import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
const modelName = 'gemini-3.1-flash-lite';
console.log('Testing model:', modelName);
const ai = new GoogleGenerativeAI(apiKey);
const model = ai.getGenerativeModel({ model: modelName });
const result = await model.generateContent('Please confirm that the Gemini API key and this model configuration work.');
console.log('Success response:', result.response.text());