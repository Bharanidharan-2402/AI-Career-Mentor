import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import { roadmapSchema } from '../utils/validators.js';
import roadmapAgent from '../agents/roadmapAgent.js';

export const generateRoadmap = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { targetRole } = roadmapSchema.parse(req.body);
    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    const roadmapResult = await roadmapAgent(profile, targetRole);
    const roadmap = await Roadmap.create({ user: userId, role: targetRole, periods: roadmapResult.roadmaps, resources: roadmapResult.resources, milestones: roadmapResult.milestones });

    res.json({ success: true, data: { roadmap, roadmapResult } });
  } catch (error) {
    next(error);
  }
};
