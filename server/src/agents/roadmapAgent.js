import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const roadmapAgent = async (profile, targetRole) => {
  const prompt = await loadPrompt('roadmap.txt');
  const aiRaw = await generateAIResponse(prompt, { profile, targetRole });

  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    return {
      roadmaps: {
        '30': ['Review role requirements', 'Practice core skills', 'Update resume with recent work'],
        '60': ['Build a relevant portfolio project', 'Network with peers', 'Refine interview answers'],
        '90': ['Apply to target roles', 'Prepare mock interviews', 'Follow up with recruiters']
      },
      resources: ['Official documentation', 'Online tutorials', 'Community forums'],
      milestones: ['Skill gap reduced', 'Portfolio completed', 'Interview ready']
    };
  }
};

export default roadmapAgent;
