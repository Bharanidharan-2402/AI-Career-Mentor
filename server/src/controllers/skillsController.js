import SkillGap from '../models/SkillGap.js';
import User from '../models/User.js';
import { skillGapSchema } from '../utils/validators.js';
import skillGapAgent from '../agents/skillGapAgent.js';

export const generateSkillGap = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { targetRole } = skillGapSchema.parse(req.body);
    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    const gapResult = await skillGapAgent(profile, targetRole);
    const skillGap = await SkillGap.create({ user: userId, targetRole, identifiedGaps: gapResult.missingSkills, recommendedSkills: gapResult.priorityRecommendations });

    res.json({ success: true, data: { skillGap, gapResult } });
  } catch (error) {
    next(error);
  }
};
