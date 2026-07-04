import mongoose from 'mongoose';

const skillGapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, required: true },
  identifiedGaps: { type: Array, default: [] },
  recommendedSkills: { type: Array, default: [] },
  generatedAt: { type: Date, default: Date.now }
});

const SkillGap = mongoose.model('SkillGap', skillGapSchema);
export default SkillGap;
