import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const projectRecommendationAgent = async (profile, targetRole, skillLevel) => {
  const prompt = await loadPrompt('projects.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole, skillLevel });

  try {
    return JSON.parse(aiRaw);
  } catch (error) {
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
  }
};

export default projectRecommendationAgent;
