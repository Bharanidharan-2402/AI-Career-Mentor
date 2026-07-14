import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { exchangeGoogleCode } from '../utils/oauth.js';

const createToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign({ id: user._id }, jwtSecret, {
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

export const googleAuth = async (req, res, next) => {
  try {
    const { code, redirectUri } = req.body;
    if (!code || !redirectUri) {
      return res.status(400).json({ success: false, error: { message: 'Google authorization code and redirect URI are required' } });
    }

    const googleUser = await exchangeGoogleCode({ code, redirectUri });
    const email = googleUser.email?.toLowerCase();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: googleUser.name || googleUser.email?.split('@')[0] || 'Google User',
        email,
        password: await bcrypt.hash(`${Date.now()}-${Math.random()}`, 12),
        careerGoal: 'Software Engineer',
        authProvider: 'google'
      });
    }

    const token = createToken(user);
    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, careerGoal: user.careerGoal },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};
