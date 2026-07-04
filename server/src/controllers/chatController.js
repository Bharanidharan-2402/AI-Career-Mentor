import ChatHistory from '../models/ChatHistory.js';
import User from '../models/User.js';
import { chatSchema } from '../utils/validators.js';
import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

export const chatWithAI = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { message } = chatSchema.parse(req.body);
    const user = await User.findById(userId);
    const history = await ChatHistory.findOne({ user: userId }) || await ChatHistory.create({ user: userId, messages: [] });

    const prompt = await loadPrompt('planner.txt');
    const aiRaw = await generateAIResponse(prompt, { profile: user.aiProfile || {}, message, history: history.messages });
    history.messages.push({ role: 'user', text: message, createdAt: new Date() });
    history.messages.push({ role: 'ai', text: aiRaw, createdAt: new Date() });
    await history.save();

    res.json({ success: true, data: { message: aiRaw, history } });
  } catch (error) {
    next(error);
  }
};
