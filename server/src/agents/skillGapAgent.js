import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const skillGapAgent = async (profile, targetRole) => {
  const prompt = await loadPrompt('skillGap.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole });
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('Skill Gap agent returned invalid JSON');
  }
};

export default skillGapAgent;
