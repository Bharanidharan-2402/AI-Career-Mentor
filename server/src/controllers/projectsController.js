import ProjectRecommendation from '../models/ProjectRecommendation.js';
import User from '../models/User.js';
import { projectSchema } from '../utils/validators.js';
import projectRecommendationAgent from '../agents/projectRecommendationAgent.js';

export const recommendProjects = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { targetRole, skillLevel } = projectSchema.parse(req.body);
    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    const recommendations = await projectRecommendationAgent(profile, targetRole, skillLevel);
    const projectData = await ProjectRecommendation.create({ user: userId, role: targetRole, skillLevel, recommendations });

    res.json({ success: true, data: { projectData, recommendations } });
  } catch (error) {
    next(error);
  }
};
