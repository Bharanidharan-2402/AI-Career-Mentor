import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const skillGapAgent = async (profile, targetRole) => {
  const prompt = await loadPrompt('skillGap.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole });

  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    return {
      missingSkills: ['Core technical fundamentals', 'Practical project experience', 'Role-specific tools'],
      priorityRecommendations: ['Build a project using the core tech stack', 'Study interview patterns for your target role', 'Document key accomplishments clearly']
    };
  }
};

export default skillGapAgent;
