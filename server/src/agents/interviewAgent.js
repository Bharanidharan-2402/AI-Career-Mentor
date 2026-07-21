import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const tryParseJson = (raw) => {
  if (!raw) return null;
  const s = typeof raw === 'string' ? raw.trim() : raw;
  if (typeof s !== 'string') return s;
  // look for ```json ... ``` or ``` ... ``` blocks
  const jsonMatch = s.match(/```json\s*([\s\S]*?)\s*```/i) || s.match(/```([\s\S]*?)```/i);
  const candidate = jsonMatch ? jsonMatch[1] : s;
  try {
    return JSON.parse(candidate);
  } catch (err) {
    try {
      const start = candidate.indexOf('{');
      const end = candidate.lastIndexOf('}');
      if (start >= 0 && end > start) {
        return JSON.parse(candidate.slice(start, end + 1));
      }
    } catch (e) {
      return null;
    }
    return null;
  }
};

const interviewAgent = async (profile, targetRole) => {
  const prompt = await loadPrompt('interview.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole });

  const parsed = tryParseJson(aiRaw);
  if (parsed && typeof parsed === 'object') return parsed;

  // Fallback: try to extract question/answer pairs heuristically from aiRaw
  // If everything fails, return a sensible default question for the target role
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
};

export default interviewAgent;
