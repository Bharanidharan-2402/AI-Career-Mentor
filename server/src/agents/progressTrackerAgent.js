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

const progressTrackerAgent = async (progress, profile, targetRole) => {
  const prompt = await loadPrompt('progressTracker.txt');
  const aiRaw = await generateAIResponse(prompt, { progress, profile, targetRole });
  const parsed = tryParseJson(aiRaw);

  if (parsed && typeof parsed === 'object') {
    return parsed;
  }

  // Graceful fallback — never crash the progress update endpoint
  return {
    recommendation: typeof aiRaw === 'string' && aiRaw.trim()
      ? aiRaw.trim()
      : `Keep up the momentum! Focus on completing your remaining tasks for ${targetRole || 'your target role'} and practice interviews regularly.`,
    nextSteps: [
      'Complete pending roadmap tasks',
      'Practice at least one mock interview this week',
      'Review skill gaps and add relevant projects'
    ]
  };
};

export default progressTrackerAgent;
