import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const interviewAgent = async (profile, targetRole) => {
  const prompt = await loadPrompt('interview.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole });
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('Interview Coach agent returned invalid JSON');
  }
};

export default interviewAgent;
