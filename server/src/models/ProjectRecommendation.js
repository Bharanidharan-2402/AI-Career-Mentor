import mongoose from 'mongoose';

const projectRecommendationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  skillLevel: { type: String, required: true },
  recommendations: { type: Array, default: [] },
  generatedAt: { type: Date, default: Date.now }
});

const ProjectRecommendation = mongoose.model('ProjectRecommendation', projectRecommendationSchema);
export default ProjectRecommendation;
