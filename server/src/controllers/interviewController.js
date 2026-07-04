import InterviewHistory from '../models/InterviewHistory.js';
import User from '../models/User.js';
import { interviewSchema } from '../utils/validators.js';
import interviewAgent from '../agents/interviewAgent.js';

export const generateInterviewQuestions = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { targetRole, interviewType } = interviewSchema.parse(req.body);
    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    const interviewPackage = await interviewAgent(profile, targetRole);
    const history = await InterviewHistory.create({ user: userId, interviewType, role: targetRole, questions: interviewPackage.questions, feedback: '', scores: 0 });

    res.json({ success: true, data: { history, interviewPackage } });
  } catch (error) {
    next(error);
  }
};
