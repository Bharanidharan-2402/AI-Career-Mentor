import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const tryParseJson = (raw) => {
  if (!raw) return null;
  const s = typeof raw === 'string' ? raw.trim() : raw;
  if (typeof s !== 'string') return s;
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

const plannerAgent = async (context) => {
  const prompt = await loadPrompt('planner.txt');
  const aiRaw = await generateAIResponse(prompt, context);
  const parsed = tryParseJson(aiRaw);

  if (parsed && typeof parsed === 'object') {
    return parsed;
  }

  // Graceful fallback
  return {
    plan: typeof aiRaw === 'string' && aiRaw.trim() ? aiRaw.trim() : 'Plan generation unavailable. Please try again.',
    tasks: []
  };
};

export default plannerAgent;
