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
    // Normalize matchedSkills
    const matchedSkills = Array.isArray(parsed.matchedSkills)
      ? parsed.matchedSkills.map((s) => {
          if (typeof s === 'string') return { name: s, relevance: 'Medium' };
          return { name: s.name || String(s), relevance: s.relevance || 'Medium' };
        })
      : [];

    // Normalize missingSkills — support both flat strings and rich objects
    const missingSkills = Array.isArray(parsed.missingSkills)
      ? parsed.missingSkills.map((s) => {
          if (typeof s === 'string') {
            return { name: s, category: 'General', demandLevel: 'Medium', reason: '' };
          }
          return {
            name: s.name || String(s),
            category: s.category || 'General',
            demandLevel: s.demandLevel || s.demand_level || 'Medium',
            reason: s.reason || s.why || ''
          };
        })
      : [];

    return {
      matchedSkills,
      missingSkills,
      priorityRecommendations: Array.isArray(parsed.priorityRecommendations)
        ? parsed.priorityRecommendations
        : []
    };
  }

  return {
    matchedSkills: [],
    missingSkills: [
      { name: 'Core technical fundamentals', category: 'General', demandLevel: 'High', reason: 'Foundation for all technical roles' },
      { name: 'Practical project experience', category: 'General', demandLevel: 'High', reason: 'Demonstrates hands-on ability to build' },
      { name: 'Role-specific tools', category: 'General', demandLevel: 'Medium', reason: 'Industry-standard tooling expected by employers' }
    ],
    priorityRecommendations: [
      'Build a project using the core tech stack',
      'Study interview patterns for your target role',
      'Document key accomplishments clearly'
    ]
  };
};

export default skillGapAgent;
