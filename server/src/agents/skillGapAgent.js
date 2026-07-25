import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const tryParseJson = (raw) => {
  if (!raw) return null;
  const s = typeof raw === 'string' ? raw.trim() : raw;
  if (typeof s !== 'string') return s;
  // Strip markdown code fences (```json ... ``` or ``` ... ```)
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

const skillGapAgent = async (profile, targetRole) => {
  const prompt = await loadPrompt('skillGap.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole });

  const parsed = tryParseJson(aiRaw);
  if (parsed && typeof parsed === 'object') {
    return {
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      priorityRecommendations: Array.isArray(parsed.priorityRecommendations) ? parsed.priorityRecommendations : []
    };
  }

  return {
    missingSkills: ['Core technical fundamentals', 'Practical project experience', 'Role-specific tools'],
    priorityRecommendations: [
      'Build a project using the core tech stack',
      'Study interview patterns for your target role',
      'Document key accomplishments clearly'
    ]
  };
};

export default skillGapAgent;
