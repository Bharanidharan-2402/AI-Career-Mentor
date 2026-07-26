import SkillGap from '../models/SkillGap.js';
import LearningPlan from '../models/LearningPlan.js';
import User from '../models/User.js';
import { skillGapSchema } from '../utils/validators.js';
import skillGapAgent from '../agents/skillGapAgent.js';
import skillRoadmapAgent from '../agents/skillRoadmapAgent.js';

/* ─── Skill Gap Analysis ─── */
export const generateSkillGap = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { targetRole } = skillGapSchema.parse(req.body);
    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    const gapResult = await skillGapAgent(profile, targetRole);

    // Normalize missingSkills to always be objects
    const identifiedGaps = (gapResult.missingSkills || []).map((skill) => {
      if (typeof skill === 'string') {
        return { name: skill, category: 'General', demandLevel: 'Medium', reason: '' };
      }
      return {
        name: skill.name || String(skill),
        category: skill.category || 'General',
        demandLevel: skill.demandLevel || 'Medium',
        reason: skill.reason || ''
      };
    });

    // Normalize matchedSkills
    const matchedSkills = (gapResult.matchedSkills || []).map((skill) => {
      if (typeof skill === 'string') {
        return { name: skill, relevance: 'Medium' };
      }
      return {
        name: skill.name || String(skill),
        relevance: skill.relevance || 'Medium'
      };
    });

    const skillGap = await SkillGap.create({
      user: userId,
      targetRole,
      matchedSkills,
      identifiedGaps,
      recommendedSkills: gapResult.priorityRecommendations || []
    });

    res.json({
      success: true,
      data: {
        skillGap,
        gapResult: {
          matchedSkills,
          missingSkills: identifiedGaps,
          priorityRecommendations: gapResult.priorityRecommendations || []
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/* ─── Generate a Learning Plan for a Specific Skill ─── */
export const generateSkillRoadmap = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { skillName, targetRole } = req.body;

    if (!skillName || typeof skillName !== 'string' || skillName.trim().length < 1) {
      return res.status(400).json({ success: false, error: { message: 'skillName is required' } });
    }
    if (!targetRole || typeof targetRole !== 'string' || targetRole.trim().length < 3) {
      return res.status(400).json({ success: false, error: { message: 'targetRole is required' } });
    }

    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    // Check if a plan already exists for this user+skill
    const existing = await LearningPlan.findOne({ user: userId, skillName: skillName.trim() });
    if (existing) {
      return res.json({ success: true, data: { learningPlan: existing, alreadyExists: true } });
    }

    const roadmapResult = await skillRoadmapAgent(profile, targetRole, skillName.trim());

    const learningPlan = await LearningPlan.create({
      user: userId,
      skillName: roadmapResult.skill || skillName.trim(),
      targetRole,
      totalWeeks: roadmapResult.totalWeeks || roadmapResult.modules?.length || 4,
      modules: roadmapResult.modules || [],
      status: 'active'
    });

    res.json({ success: true, data: { learningPlan, alreadyExists: false } });
  } catch (error) {
    // Handle duplicate key error gracefully
    if (error.code === 11000) {
      const existing = await LearningPlan.findOne({
        user: req.user.id,
        skillName: req.body.skillName?.trim()
      });
      return res.json({ success: true, data: { learningPlan: existing, alreadyExists: true } });
    }
    next(error);
  }
};

/* ─── Get All Learning Plans for the User ─── */
export const getUserLearningPlans = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const plans = await LearningPlan.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: { learningPlans: plans } });
  } catch (error) {
    next(error);
  }
};

/* ─── Toggle a Task in a Learning Plan ─── */
export const toggleLearningTask = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { planId, taskKey } = req.body;

    if (!planId || !taskKey || typeof taskKey !== 'string') {
      return res.status(400).json({ success: false, error: { message: 'planId and taskKey are required' } });
    }

    const plan = await LearningPlan.findOne({ _id: planId, user: userId });
    if (!plan) {
      return res.status(404).json({ success: false, error: { message: 'Learning plan not found' } });
    }

    const completed = plan.completedTasks || [];
    const idx = completed.indexOf(taskKey);
    if (idx === -1) {
      completed.push(taskKey);
    } else {
      completed.splice(idx, 1);
    }

    plan.completedTasks = completed;
    plan.updatedAt = new Date();

    // Auto-detect completion
    const totalTasks = plan.modules.reduce((sum, mod) => sum + (mod.tasks?.length || 0), 0);
    if (completed.length >= totalTasks && totalTasks > 0) {
      plan.status = 'completed';
    } else if (plan.status === 'completed') {
      plan.status = 'active'; // un-complete if a task was unchecked
    }

    await plan.save();
    res.json({ success: true, data: { learningPlan: plan } });
  } catch (error) {
    next(error);
  }
};

/* ─── Update Learning Plan Status (pause/resume/complete) ─── */
export const updatePlanStatus = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { planId, status } = req.body;

    if (!planId || !['active', 'paused', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, error: { message: 'planId and valid status are required' } });
    }

    const plan = await LearningPlan.findOne({ _id: planId, user: userId });
    if (!plan) {
      return res.status(404).json({ success: false, error: { message: 'Learning plan not found' } });
    }

    plan.status = status;
    plan.updatedAt = new Date();
    await plan.save();

    res.json({ success: true, data: { learningPlan: plan } });
  } catch (error) {
    next(error);
  }
};
