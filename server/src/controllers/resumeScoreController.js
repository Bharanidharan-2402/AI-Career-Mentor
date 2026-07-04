import User from '../models/User.js';
import { resumeScoreSchema } from '../utils/validators.js';
import resumeImprovementAgent from '../agents/resumeImprovementAgent.js';

export const scoreResume = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { resumeText, targetRole } = resumeScoreSchema.parse(req.body);
    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    const scoreResult = await resumeImprovementAgent(profile, resumeText, targetRole);
    res.json({ success: true, data: { scoreResult } });
  } catch (error) {
    next(error);
  }
};
