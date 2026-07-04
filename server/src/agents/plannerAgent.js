import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const plannerAgent = async (context) => {
  const prompt = await loadPrompt('planner.txt');
  const aiRaw = await generateAIResponse(prompt, context);
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('Planner agent returned invalid JSON');
  }
};

export default plannerAgent;
