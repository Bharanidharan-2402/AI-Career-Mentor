import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  analysis: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
