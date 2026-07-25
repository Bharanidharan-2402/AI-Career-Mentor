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

const resumeImprovementAgent = async (profile, resumeText, targetRole) => {
  const prompt = await loadPrompt('resumeScore.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, resumeText, targetRole });
  const parsed = tryParseJson(aiRaw);

  if (parsed && typeof parsed === 'object') {
    return {
      score: parsed.score ?? parsed.atsScore ?? 60,
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : (parsed.suggestions || []),
      rewrittenBullets: Array.isArray(parsed.rewrittenBullets) ? parsed.rewrittenBullets : (parsed.bullets || []),
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : []
    };
  }

  // Graceful fallback — never crash the resume score endpoint
  return {
    score: 60,
    recommendations: [
      'Add quantified achievements to your bullet points',
      `Include keywords relevant to ${targetRole || 'your target role'}`,
      'Use strong action verbs at the start of each bullet',
      'Ensure contact information is clearly visible'
    ],
    rewrittenBullets: [
      'Developed and maintained scalable web applications serving 10,000+ users',
      'Collaborated with cross-functional teams to deliver features on time'
    ],
    keywords: []
  };
};

export default resumeImprovementAgent;
