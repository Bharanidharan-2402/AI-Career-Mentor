import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  focusSkill: { type: String, default: null },
  periods: { type: mongoose.Schema.Types.Mixed, default: {} },
  resources: { type: mongoose.Schema.Types.Mixed, default: [] },
  milestones: { type: Array, default: [] },
  selectedPlan: { type: String, enum: ['30', '60', '90', null], default: null },
  completedTasks: { type: [Number], default: [] },
  activatedAt: { type: Date, default: null },
  generatedAt: { type: Date, default: Date.now }
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
