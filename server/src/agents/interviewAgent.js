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

const normalizeType = (value) => {
  if (!value) return '';
  return String(value).trim().toLowerCase();
};

const buildQuestion = (item, index, interviewType) => ({
  category: interviewType,
  question: item.question || item.prompt || `Question ${index + 1} for ${interviewType} interview in ${item.role || 'the target role'}.`,
  difficulty: item.difficulty || item.level || 'Medium',
  idealAnswer: item.idealAnswer || item.answer || item.response || '',
  hint: item.hint || item.tip || ''
});

const interviewAgent = async (profile, targetRole, interviewType, questionCount = 5) => {
  const prompt = await loadPrompt('interview.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole, interviewType, questionCount });

  const parsed = tryParseJson(aiRaw);
  if (parsed && typeof parsed === 'object') {
    const requestedType = normalizeType(interviewType);
    const rawQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];
    const fixedQuestions = rawQuestions
      .map((item, index) => buildQuestion(item, index, interviewType))
      .slice(0, questionCount);

    const categoryMatch = fixedQuestions.every((q) => normalizeType(q.category) === requestedType);
    if (fixedQuestions.length >= questionCount && categoryMatch) {
      return {
        role: targetRole,
        interviewType,
        questions: fixedQuestions
      };
    }
  }

  const questions = Array.from({ length: questionCount }, (_, index) => ({
    category: interviewType,
    question: `Practice question ${index + 1} for ${interviewType} interview in ${targetRole}.`,
    difficulty: 'Medium',
    idealAnswer: `Provide a strong, structured answer tailored to ${interviewType.toLowerCase()} topics for ${targetRole}.`,
    hint: `Keep your response focused on ${interviewType.toLowerCase()} concepts relevant to ${targetRole}.`
  }));

  return {
    role: targetRole,
    interviewType,
    questions
  };
};

export default interviewAgent;
