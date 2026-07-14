import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  careerGoal: { type: String, default: 'Software Engineer' },
  authProvider: { type: String, default: 'local' },
  resumeUploadedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  aiProfile: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const User = mongoose.model('User', userSchema);
export default User;
