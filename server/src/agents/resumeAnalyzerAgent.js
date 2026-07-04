import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const resumeAnalyzerAgent = async (resumeText) => {
  const prompt = await loadPrompt('resumeAnalyzer.txt');
  const aiRaw = await generateAIResponse(prompt, { resumeText });
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('Resume Analyzer agent returned invalid JSON');
  }
};

export default resumeAnalyzerAgent;
