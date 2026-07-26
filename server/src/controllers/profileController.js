import fs from 'fs';
import path from 'path';
import User from '../models/User.js';

export const uploadPhoto = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: 'Photo file is required' } });
    }

    const storedPath = path.join('uploads', req.file.filename);
    const publicBaseUrl = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const publicUrl = `${publicBaseUrl.replace(/\/$/, '')}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(userId, { photoUrl: publicUrl }, { new: true });

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const user = await User.findById(userId);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export default { uploadPhoto, getProfile };
