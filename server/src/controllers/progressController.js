import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { progressSchema } from '../utils/validators.js';
import progressTrackerAgent from '../agents/progressTrackerAgent.js';

export const getProgress = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const progress = await Progress.findOne({ user: userId }) || { tasksCompleted: 0, totalTasks: 0, completedTopics: [], projectsCompleted: [], practiceHistory: [], interviewPerformance: [] };

    res.json({ success: true, data: { progress } });
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const update = progressSchema.parse(req.body);
    const progress = await Progress.findOneAndUpdate({ user: userId }, { ...update, updatedAt: new Date() }, { new: true, upsert: true });
    const user = await User.findById(userId);
    const recommendation = await progressTrackerAgent(progress, user.aiProfile || {}, user.careerGoal);

    res.json({ success: true, data: { progress, recommendation } });
  } catch (error) {
    next(error);
  }
};
