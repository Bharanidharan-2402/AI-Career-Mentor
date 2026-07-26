import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  try {
    model = genAI.getGenerativeModel({ model: modelName });
    return true;
  } catch (error) {
    logger.error('Failed to initialize Gemini model', { modelName, error: error.message });
    model = null;
    return false;
  }
};

const loadPrompt = async (promptFile) => {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(process.cwd(), 'prompts', promptFile),
    path.resolve(process.cwd(), 'server', 'prompts', promptFile),
    path.resolve(currentDir, '..', '..', 'prompts', promptFile)
  ];

  const existingPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!existingPath) {
    throw new Error(`Prompt file not found: ${promptFile}`);
  }

  return fs.promises.readFile(existingPath, 'utf-8');
};

const getUserFriendlyErrorMessage = (error) => {
  const message = error?.message || '';
  const status = error?.status;

  if (status === 429 || /429|quota|rate limit|too many requests|exceeded your current quota/i.test(message)) {
    return 'Gemini API quota has been exceeded. Please wait a bit and try again later, or upgrade your plan.';
  }

  if (status === 401 || /api key|authentication|unauthorized/i.test(message)) {
    return 'Gemini API key is invalid or unauthorized. Please check your server configuration.';
  }

  return 'AI service unavailable. Please try again later.';
};

const generateAIResponse = async (prompt, userInput) => {
  if (!model) {
    logger.warn('AI service is not initialized. Returning fallback text.');
    return 'AI service unavailable. Please configure GEMINI_API_KEY to enable intelligent responses.';
  }

  const message = `${prompt}\n\nUser context:\n${JSON.stringify(userInput, null, 2)}`;

  try {
    const result = await model.generateContent(message);
    const response = result.response;
    return response.text();
  } catch (error) {
    logger.error('Gemini generateContent failed', { status: error?.status, error: error.message });
    return getUserFriendlyErrorMessage(error);
  }
};

export { initializeAI, loadPrompt, generateAIResponse };
