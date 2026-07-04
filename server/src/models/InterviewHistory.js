import mongoose from 'mongoose';

const interviewHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interviewType: { type: String, required: true },
  role: { type: String, required: true },
  questions: { type: Array, default: [] },
  scores: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  completedAt: { type: Date, default: Date.now }
});

const InterviewHistory = mongoose.model('InterviewHistory', interviewHistorySchema);
export default InterviewHistory;
