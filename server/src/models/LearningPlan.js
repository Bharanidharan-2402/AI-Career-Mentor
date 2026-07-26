import mongoose from 'mongoose';

const learningPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillName: { type: String, required: true },
  targetRole: { type: String, required: true },
  totalWeeks: { type: Number, default: 4 },
  modules: {
    type: [{
      week: Number,
      title: String,
      description: String,
      tasks: [{
        title: String,
        resourceUrl: String,
        resourceLabel: String,
        estimatedHours: Number
      }]
    }],
    default: []
  },
  completedTasks: { type: [String], default: [] }, // "moduleIndex-taskIndex" keys
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for fast per-user queries
learningPlanSchema.index({ user: 1, status: 1 });
// Prevent duplicate active plans for the same skill
learningPlanSchema.index({ user: 1, skillName: 1 }, { unique: true });

const LearningPlan = mongoose.model('LearningPlan', learningPlanSchema);
export default LearningPlan;
