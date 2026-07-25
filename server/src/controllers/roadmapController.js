import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import { roadmapSchema } from '../utils/validators.js';
import roadmapAgent from '../agents/roadmapAgent.js';

export const generateRoadmap = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { targetRole } = roadmapSchema.parse(req.body);
    const focusSkill = req.body.focusSkill || null;
    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    const roadmapResult = await roadmapAgent(profile, targetRole, focusSkill);

    // Store periods as a map keyed by '30', '60', '90'
    const roadmap = await Roadmap.create({
      user: userId,
      role: targetRole,
      focusSkill: focusSkill || null,
      periods: roadmapResult.roadmaps,
      resources: roadmapResult.resources,
      milestones: roadmapResult.milestones
    });

    res.json({ success: true, data: { roadmap, roadmapResult } });
  } catch (error) {
    next(error);
  }
};

export const getActiveRoadmap = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    // Get the most recent roadmap that has a selected plan
    let roadmap = await Roadmap.findOne({ user: userId, selectedPlan: { $ne: null } }).sort({ activatedAt: -1 });

    // If no active plan, get the latest roadmap
    if (!roadmap) {
      roadmap = await Roadmap.findOne({ user: userId }).sort({ generatedAt: -1 });
    }

    if (!roadmap) {
      return res.json({ success: true, data: { roadmap: null } });
    }

    res.json({ success: true, data: { roadmap } });
  } catch (error) {
    next(error);
  }
};

export const selectPlan = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { roadmapId, plan } = req.body;

    if (!['30', '60', '90'].includes(plan)) {
      return res.status(400).json({ success: false, error: { message: 'Plan must be 30, 60, or 90' } });
    }

    const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId });
    if (!roadmap) {
      return res.status(404).json({ success: false, error: { message: 'Roadmap not found' } });
    }

    roadmap.selectedPlan = plan;
    roadmap.completedTasks = [];
    roadmap.activatedAt = new Date();
    await roadmap.save();

    res.json({ success: true, data: { roadmap } });
  } catch (error) {
    next(error);
  }
};

export const toggleTask = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { roadmapId, taskIndex } = req.body;

    if (typeof taskIndex !== 'number' || taskIndex < 0) {
      return res.status(400).json({ success: false, error: { message: 'Invalid task index' } });
    }

    const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId });
    if (!roadmap) {
      return res.status(404).json({ success: false, error: { message: 'Roadmap not found' } });
    }

    const completed = roadmap.completedTasks || [];
    const idx = completed.indexOf(taskIndex);
    if (idx === -1) {
      completed.push(taskIndex);
    } else {
      completed.splice(idx, 1);
    }

    roadmap.completedTasks = completed;
    await roadmap.save();

    res.json({ success: true, data: { roadmap } });
  } catch (error) {
    next(error);
  }
};
