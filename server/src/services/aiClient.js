import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../config/logger.js';

let genAI;
let model;

const initializeAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logger.warn('GEMINI_API_KEY not set. AI features will not work.');
    return false;
  }
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  return true;
};

const loadPrompt = async (promptFile) => {
  const filePath = path.resolve(process.cwd(), 'server', 'prompts', promptFile);
  return fs.promises.readFile(filePath, 'utf-8');
};

const generateAIResponse = async (prompt, userInput) => {
  if (!model) {
    throw new Error('AI service not initialized. Please set GEMINI_API_KEY in .env');
  }
  const message = `${prompt}\n\nUser context:\n${JSON.stringify(userInput, null, 2)}`;
  const result = await model.generateContent(message);
  const response = result.response;
  return response.text();
};

export { initializeAI, loadPrompt, generateAIResponse };
