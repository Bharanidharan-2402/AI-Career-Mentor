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
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, error: { message: 'Email already registered' } });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: normalizedEmail, password: hashedPassword, careerGoal });
    const token = createToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          careerGoal,
          photoUrl: user.photoUrl || null,
          aiProfile: user.aiProfile || {},
          resumeUploadedAt: user.resumeUploadedAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }

    let validPassword = false;
    try {
      validPassword = await bcrypt.compare(password, user.password);
    } catch (compareError) {
      return res.status(500).json({ success: false, error: { message: 'Unable to verify password' } });
    }

    if (!validPassword) {
      return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
    }

    const token = createToken(user);
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          careerGoal: user.careerGoal,
          photoUrl: user.photoUrl || null,
          aiProfile: user.aiProfile || {},
          resumeUploadedAt: user.resumeUploadedAt
        },
        token
      }
    });
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
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          careerGoal: user.careerGoal,
          photoUrl: user.photoUrl || null,
          aiProfile: user.aiProfile || {},
          resumeUploadedAt: user.resumeUploadedAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, error: { message: 'Not authenticated' } });
  }
  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        careerGoal: user.careerGoal,
        role: user.role,
        authProvider: user.authProvider,
        photoUrl: user.photoUrl || null,
        aiProfile: user.aiProfile || {},
        resumeUploadedAt: user.resumeUploadedAt || null,
        createdAt: user.createdAt
      }
    }
  });
};

