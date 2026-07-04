import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerSchema, loginSchema } from '../utils/validators.js';

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, careerGoal } = registerSchema.parse(req.body);
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, error: { message: 'Email already registered' } });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, careerGoal });
    const token = createToken(user);

    res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, careerGoal }, token } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }

    const token = createToken(user);
    res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, careerGoal: user.careerGoal }, token } });
  } catch (error) {
    next(error);
  }
};
