import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  periods: { type: Array, default: [] },
  resources: { type: Array, default: [] },
  milestones: { type: Array, default: [] },
  generatedAt: { type: Date, default: Date.now }
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
