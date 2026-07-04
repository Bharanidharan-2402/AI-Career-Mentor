import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tasksCompleted: { type: Number, default: 0 },
  totalTasks: { type: Number, default: 0 },
  completedTopics: { type: Array, default: [] },
  projectsCompleted: { type: Array, default: [] },
  practiceHistory: { type: Array, default: [] },
  interviewPerformance: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now }
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
