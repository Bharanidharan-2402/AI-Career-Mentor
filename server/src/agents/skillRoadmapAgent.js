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

/**
 * Normalizes a module from the AI response into a consistent shape.
 */
const normalizeModule = (mod, index) => {
  if (!mod || typeof mod !== 'object') return null;
  return {
    week: mod.week || index + 1,
    title: mod.title || mod.name || `Week ${index + 1}`,
    description: mod.description || mod.summary || '',
    tasks: Array.isArray(mod.tasks) ? mod.tasks.map(normalizeTask) : []
  };
};

const normalizeTask = (task) => {
  if (typeof task === 'string') {
    return { title: task, resourceUrl: '', resourceLabel: '', estimatedHours: 1 };
  }
  if (typeof task === 'object' && task !== null) {
    return {
      title: task.title || task.task || task.name || task.description || JSON.stringify(task),
      resourceUrl: task.resourceUrl || task.resource_url || task.url || task.link || '',
      resourceLabel: task.resourceLabel || task.resource_label || task.label || task.source || '',
      estimatedHours: task.estimatedHours || task.estimated_hours || task.hours || 1
    };
  }
  return { title: String(task), resourceUrl: '', resourceLabel: '', estimatedHours: 1 };
};

const skillRoadmapAgent = async (profile, targetRole, skillName) => {
  const prompt = await loadPrompt('skillRoadmap.txt');

  const enrichedProfile = {
    skills: profile?.skills || [],
    experience: profile?.experience || profile?.workExperience || [],
    projects: profile?.projects || [],
    education: profile?.education || [],
    summary: profile?.summary || '',
    certifications: profile?.certifications || [],
    targetRole
  };

  const userContext = {
    profile: enrichedProfile,
    targetRole,
    skillToMaster: skillName
  };

  const aiRaw = await generateAIResponse(prompt, userContext);
  const parsed = tryParseJson(aiRaw);

  if (parsed && typeof parsed === 'object') {
    const rawModules = parsed.modules || parsed.weeks || parsed.plan || [];
    const modules = Array.isArray(rawModules)
      ? rawModules.map(normalizeModule).filter(Boolean)
      : [];

    return {
      skill: parsed.skill || skillName,
      totalWeeks: parsed.totalWeeks || parsed.total_weeks || modules.length,
      modules
    };
  }

  // Fallback if AI fails
  return {
    skill: skillName,
    totalWeeks: 4,
    modules: [
      {
        week: 1,
        title: `${skillName} — Foundations`,
        description: `Build a solid understanding of ${skillName} fundamentals`,
        tasks: [
          { title: `Read the official ${skillName} documentation`, resourceUrl: 'https://developer.mozilla.org/', resourceLabel: 'MDN Docs', estimatedHours: 2 },
          { title: `Watch an introductory ${skillName} video tutorial`, resourceUrl: 'https://www.youtube.com/', resourceLabel: 'YouTube', estimatedHours: 1 },
          { title: `Complete a beginner exercise set`, resourceUrl: 'https://www.freecodecamp.org/', resourceLabel: 'freeCodeCamp', estimatedHours: 2 }
        ]
      },
      {
        week: 2,
        title: `${skillName} — Core Concepts`,
        description: `Dive deeper into the core patterns and techniques`,
        tasks: [
          { title: `Build a small practice project using ${skillName}`, resourceUrl: 'https://www.freecodecamp.org/', resourceLabel: 'freeCodeCamp', estimatedHours: 3 },
          { title: `Practice problems related to ${skillName}`, resourceUrl: 'https://www.hackerrank.com/', resourceLabel: 'HackerRank', estimatedHours: 2 },
          { title: `Study real-world use cases and best practices`, resourceUrl: 'https://www.geeksforgeeks.org/', resourceLabel: 'GeeksForGeeks', estimatedHours: 1.5 }
        ]
      },
      {
        week: 3,
        title: `${skillName} — Intermediate Projects`,
        description: `Apply your knowledge to build something meaningful`,
        tasks: [
          { title: `Build a portfolio-worthy project using ${skillName}`, resourceUrl: 'https://github.com/explore', resourceLabel: 'GitHub Explore', estimatedHours: 4 },
          { title: `Review open-source ${skillName} projects for patterns`, resourceUrl: 'https://github.com/', resourceLabel: 'GitHub', estimatedHours: 2 },
          { title: `Take an intermediate online course`, resourceUrl: 'https://www.coursera.org/', resourceLabel: 'Coursera', estimatedHours: 3 }
        ]
      },
      {
        week: 4,
        title: `${skillName} — Mastery & Interview Prep`,
        description: `Solidify your expertise and prepare for interviews`,
        tasks: [
          { title: `Solve advanced ${skillName} challenges`, resourceUrl: 'https://leetcode.com/', resourceLabel: 'LeetCode', estimatedHours: 3 },
          { title: `Prepare for ${skillName} interview questions`, resourceUrl: 'https://www.geeksforgeeks.org/', resourceLabel: 'GeeksForGeeks', estimatedHours: 2 },
          { title: `Contribute to an open-source ${skillName} project`, resourceUrl: 'https://github.com/explore', resourceLabel: 'GitHub Explore', estimatedHours: 3 }
        ]
      }
    ]
  };
};

export default skillRoadmapAgent;
