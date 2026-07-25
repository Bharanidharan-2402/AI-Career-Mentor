import InterviewHistory from '../models/InterviewHistory.js';
import User from '../models/User.js';
import { interviewSchema, interviewDetailSchema } from '../utils/validators.js';
import interviewAgent from '../agents/interviewAgent.js';
import interviewDetailAgent from '../agents/interviewDetailAgent.js';

export const generateInterviewQuestions = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const parsedBody = interviewSchema.parse({
      ...req.body,
      questionCount: Number(req.body.questionCount) || 5
    });
    const { targetRole, interviewType, questionCount } = parsedBody;
    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    const interviewPackage = await interviewAgent(profile, targetRole, interviewType, questionCount);
    const history = await InterviewHistory.create({ user: userId, interviewType, role: targetRole, questions: interviewPackage.questions, feedback: '', scores: 0 });

    res.json({ success: true, data: { history, interviewPackage } });
  } catch (error) {
    next(error);
  }
};

export const getInterviewQuestionDetail = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const parsedBody = interviewDetailSchema.parse(req.body);
    const { targetRole, interviewType, question } = parsedBody;
    const user = await User.findById(userId);
    const profile = user.aiProfile || {};

    const detail = await interviewDetailAgent({ profile, targetRole, interviewType, question });
    res.json({ success: true, data: { detail } });
  } catch (error) {
    console.error('Interview detail error:', error);
    if (error.name === 'ZodError') {
      res.json({ success: true, data: { detail: 'Unable to generate question detail. Please try again.' } });
      return;
    }
    res.json({ success: true, data: { detail: 'Unable to generate question detail at this time. Please try again later.' } });
  }
};
