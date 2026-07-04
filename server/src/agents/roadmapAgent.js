import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const roadmapAgent = async (profile, targetRole) => {
  const prompt = await loadPrompt('roadmap.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole });
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('Roadmap agent returned invalid JSON');
  }
};

export default roadmapAgent;
