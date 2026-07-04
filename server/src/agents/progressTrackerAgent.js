import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const progressTrackerAgent = async (progress, profile, targetRole) => {
  const prompt = await loadPrompt('progressTracker.txt');
  const aiRaw = await generateAIResponse(prompt, { progress, profile, targetRole });
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('Progress Tracker agent returned invalid JSON');
  }
};

export default progressTrackerAgent;
