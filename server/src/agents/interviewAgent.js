import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const interviewAgent = async (profile, targetRole) => {
  const prompt = await loadPrompt('interview.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole });

  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    return {
      questions: [
        {
          category: 'Technical',
          question: `Explain a core ${targetRole} concept clearly.`,
          idealAnswer: 'Provide a concise, structured explanation with an example.',
          hint: 'Focus on problem, approach, and result.'
        }
      ]
    };
  }
};

export default interviewAgent;
