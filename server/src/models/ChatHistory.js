import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, default: 'Career Mentor' },
  messages: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;
