import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const tryParseJson = (raw) => {
  if (!raw) {
    return null;
  }

  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/i) || trimmed.match(/```([\s\S]*?)```/i);
  const candidate = jsonMatch ? jsonMatch[1] : trimmed;

  try {
    return JSON.parse(candidate);
  } catch (error) {
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1));
      } catch (secondError) {
        return null;
      }
    }
    return null;
  }
};

const resumeAnalyzerAgent = async (resumeText) => {
  const prompt = await loadPrompt('resumeAnalyzer.txt');
  const aiRaw = await generateAIResponse(prompt, { resumeText });
  const parsed = tryParseJson(aiRaw);

  if (parsed) {
    return parsed;
  }

  return {
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    summary: typeof aiRaw === 'string' ? aiRaw : 'Resume analysis unavailable.',
    contact: {}
  };
};

export default resumeAnalyzerAgent;
