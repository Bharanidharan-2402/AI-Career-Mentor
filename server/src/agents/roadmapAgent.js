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
 * Normalizes a roadmap period value. The AI might return arrays of strings
 * or arrays of objects. We always want arrays of task objects with
 * { task, resourceUrl, resourceLabel }.
 */
const normalizePeriod = (value) => {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === 'string') {
      return { task: item, resourceUrl: '', resourceLabel: '' };
    }
    if (typeof item === 'object' && item !== null) {
      return {
        task: item.task || item.title || item.description || item.name || JSON.stringify(item),
        resourceUrl: item.resourceUrl || item.resource_url || item.url || item.link || '',
        resourceLabel: item.resourceLabel || item.resource_label || item.label || item.source || ''
      };
    }
    return { task: String(item), resourceUrl: '', resourceLabel: '' };
  });
};

/**
 * Normalizes resources — can be strings or objects with name/url.
 */
const normalizeResources = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((r) => {
    if (typeof r === 'string') return { name: r, url: '' };
    if (typeof r === 'object' && r !== null) {
      return {
        name: r.name || r.title || r.label || JSON.stringify(r),
        url: r.url || r.link || r.resourceUrl || ''
      };
    }
    return { name: String(r), url: '' };
  });
};

const roadmapAgent = async (profile, targetRole, focusSkill = null) => {
  const prompt = await loadPrompt('roadmap.txt');

  // Build an enriched profile summary for the AI
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
    targetRole
  };

  // If focusing on a specific skill, add it to the context
  if (focusSkill) {
    userContext.focusSkill = focusSkill;
  }

  const aiRaw = await generateAIResponse(prompt, userContext);

  const parsed = tryParseJson(aiRaw);
  if (parsed && typeof parsed === 'object') {
    const roadmaps = parsed.roadmaps || parsed.plan || parsed.plans || {};

    return {
      roadmaps: {
        '30': normalizePeriod(roadmaps['30'] || roadmaps['30_days'] || roadmaps['month1'] || []),
        '60': normalizePeriod(roadmaps['60'] || roadmaps['60_days'] || roadmaps['month2'] || []),
        '90': normalizePeriod(roadmaps['90'] || roadmaps['90_days'] || roadmaps['month3'] || [])
      },
      resources: normalizeResources(parsed.resources),
      milestones: Array.isArray(parsed.milestones) ? parsed.milestones.map(m => typeof m === 'string' ? m : m?.name || m?.title || JSON.stringify(m)) : []
    };
  }

  // Fallback if AI fails to return valid JSON
  const skillLabel = focusSkill || targetRole;
  return {
    roadmaps: {
      '30': [
        { task: `Review ${skillLabel} fundamentals and prerequisites`, resourceUrl: 'https://www.freecodecamp.org/', resourceLabel: 'freeCodeCamp' },
        { task: 'Assess current skill level with practice exercises', resourceUrl: 'https://www.hackerrank.com/', resourceLabel: 'HackerRank' },
        { task: 'Set up development environment', resourceUrl: '', resourceLabel: '' },
        { task: 'Complete beginner tutorials', resourceUrl: 'https://www.w3schools.com/', resourceLabel: 'W3Schools' },
        { task: 'Practice basic coding challenges daily', resourceUrl: 'https://leetcode.com/', resourceLabel: 'LeetCode' },
        { task: 'Read official documentation', resourceUrl: 'https://developer.mozilla.org/', resourceLabel: 'MDN Docs' },
        { task: 'Start a simple mini-project', resourceUrl: '', resourceLabel: '' },
        { task: 'Join relevant online communities', resourceUrl: 'https://stackoverflow.com/', resourceLabel: 'Stack Overflow' }
      ],
      '60': [
        { task: 'Build a relevant portfolio project', resourceUrl: '', resourceLabel: '' },
        { task: 'Complete an intermediate online course', resourceUrl: 'https://www.coursera.org/', resourceLabel: 'Coursera' },
        { task: 'Practice intermediate coding problems', resourceUrl: 'https://leetcode.com/', resourceLabel: 'LeetCode' },
        { task: 'Network with professionals in the field', resourceUrl: 'https://linkedin.com/', resourceLabel: 'LinkedIn' },
        { task: 'Contribute to an open source project', resourceUrl: 'https://github.com/explore', resourceLabel: 'GitHub Explore' },
        { task: 'Refine resume with new skills', resourceUrl: '', resourceLabel: '' },
        { task: 'Practice mock interviews', resourceUrl: 'https://www.pramp.com/', resourceLabel: 'Pramp' },
        { task: 'Study system design basics', resourceUrl: 'https://www.geeksforgeeks.org/system-design-tutorial/', resourceLabel: 'GeeksForGeeks' }
      ],
      '90': [
        { task: 'Apply to target roles', resourceUrl: '', resourceLabel: '' },
        { task: 'Complete advanced projects', resourceUrl: '', resourceLabel: '' },
        { task: 'Prepare for technical interviews', resourceUrl: 'https://leetcode.com/', resourceLabel: 'LeetCode' },
        { task: 'Polish portfolio and GitHub profile', resourceUrl: 'https://github.com/', resourceLabel: 'GitHub' },
        { task: 'Practice behavioral questions', resourceUrl: '', resourceLabel: '' },
        { task: 'Follow up with recruiters', resourceUrl: '', resourceLabel: '' },
        { task: 'Review and iterate on weak areas', resourceUrl: '', resourceLabel: '' },
        { task: 'Final mock interview round', resourceUrl: 'https://www.pramp.com/', resourceLabel: 'Pramp' }
      ]
    },
    resources: [
      { name: 'Official documentation', url: 'https://developer.mozilla.org/' },
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/' },
      { name: 'LeetCode', url: 'https://leetcode.com/' },
      { name: 'YouTube tutorials', url: 'https://www.youtube.com/' }
    ],
    milestones: ['Skill gap assessment complete', 'First portfolio project deployed', 'Interview preparation complete', 'Applications submitted']
  };
};

export default roadmapAgent;
