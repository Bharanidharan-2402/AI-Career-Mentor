import dotenv from 'dotenv';
import { initializeAI, generateAIResponse } from './src/services/aiClient.js';

dotenv.config();
const initialized = initializeAI();
console.log('Initialized:', initialized);

generateAIResponse("say hi in exactly two words", "hi").then(res => {
  console.log('AI Response:', res);
}).catch(err => {
  console.error('AI Error:', err);
});
