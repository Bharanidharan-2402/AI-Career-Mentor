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
    return null;
  }
};

const interviewDetailAgent = async ({ profile, targetRole, interviewType, question }) => {
  const prompt = await loadPrompt('interviewDetail.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole, interviewType, question });
  const parsed = tryParseJson(aiRaw);

  if (parsed && typeof parsed === 'object' && parsed.detail) {
    return parsed.detail;
  }

  return typeof aiRaw === 'string' ? aiRaw.trim() : 'No additional detail available.';
};

export default interviewDetailAgent;
