import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const projectRecommendationAgent = async (profile, targetRole, skillLevel) => {
  const prompt = await loadPrompt('projects.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole, skillLevel });
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('Project Recommendation agent returned invalid JSON');
  }
};

export default projectRecommendationAgent;
