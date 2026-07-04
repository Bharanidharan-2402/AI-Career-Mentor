import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const resumeImprovementAgent = async (profile, resumeText, targetRole) => {
  const prompt = await loadPrompt('resumeScore.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, resumeText, targetRole });
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('Resume Improvement agent returned invalid JSON');
  }
};

export default resumeImprovementAgent;
