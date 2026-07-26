import mongoose from 'mongoose';

const skillGapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, required: true },
  matchedSkills: {
    type: [{
      name: String,
      relevance: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
    }],
    default: []
  },
  identifiedGaps: {
    type: [{
      name: String,
      category: String,
      demandLevel: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
      reason: String
    }],
    default: []
  },
  recommendedSkills: { type: Array, default: [] },
  generatedAt: { type: Date, default: Date.now }
});

const SkillGap = mongoose.model('SkillGap', skillGapSchema);
export default SkillGap;
