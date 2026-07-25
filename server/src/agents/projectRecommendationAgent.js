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
      // Try to extract array
      const start = candidate.indexOf('[');
      const end = candidate.lastIndexOf(']');
      if (start >= 0 && end > start) {
        return JSON.parse(candidate.slice(start, end + 1));
      }
      // Try object
      const oStart = candidate.indexOf('{');
      const oEnd = candidate.lastIndexOf('}');
      if (oStart >= 0 && oEnd > oStart) {
        return JSON.parse(candidate.slice(oStart, oEnd + 1));
      }
    } catch (e) {
      return null;
    }
    return null;
  }
};

const projectRecommendationAgent = async (profile, targetRole, skillLevel) => {
  const prompt = await loadPrompt('projects.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole, skillLevel });

  const parsed = tryParseJson(aiRaw);

  // The AI may return an array directly, or an object with a projects key
  if (Array.isArray(parsed)) {
    return parsed;
  }
  if (parsed && typeof parsed === 'object') {
    const key = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
    if (key) return parsed[key];
  }

  return [
    {
      title: `${targetRole} Portfolio Project`,
      description: 'Build a complete project that showcases your role-specific skills and problem-solving ability.',
      difficulty: skillLevel,
      techStack: ['JavaScript', 'APIs', 'Testing']
    },
    {
      title: 'Learning Tracker Dashboard',
      description: 'Create a dashboard to track your learning goals, skills, and interview prep progress.',
      difficulty: skillLevel,
      techStack: ['React', 'Node.js', 'Database']
    }
  ];
};

export default projectRecommendationAgent;
