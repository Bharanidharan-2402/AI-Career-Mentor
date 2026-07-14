import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);
console.log('ai prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(ai)).join(', '));
console.log('ai keys:', Object.keys(ai).join(', '));
try {
  const models = await ai.listModels();
  console.log('models count:', models.length);
  console.log(models.map((m) => m.name).slice(0, 20));
} catch (err) {
  console.error('listModels failed', err?.message || err);
}