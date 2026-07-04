import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { resumeAnalysisSchema } from '../utils/validators.js';
import { parsePDF } from '../services/pdfService.js';
import resumeAnalyzerAgent from '../agents/resumeAnalyzerAgent.js';

export const uploadResume = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: 'Resume file is required' } });
    }

    const uploadPath = path.join('uploads', req.file.filename);
    await Resume.create({ user: userId, fileName: req.file.originalname, filePath: uploadPath });
    await User.findByIdAndUpdate(userId, { resumeUploadedAt: new Date() });

    res.status(201).json({ success: true, data: { message: 'Resume uploaded successfully', filePath: uploadPath } });
  } catch (error) {
    next(error);
  }
};

export const analyzeResume = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { resumeId } = resumeAnalysisSchema.parse(req.body);
    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) {
      return res.status(404).json({ success: false, error: { message: 'Resume not found' } });
    }

    const fileBuffer = await fs.promises.readFile(path.resolve(process.cwd(), 'server', resume.filePath));
    const text = await parsePDF(fileBuffer);
    const analysis = await resumeAnalyzerAgent(text);

    resume.analysis = analysis;
    await resume.save();
    await User.findByIdAndUpdate(userId, { aiProfile: analysis });

    res.json({ success: true, data: { resumeId, analysis } });
  } catch (error) {
    next(error);
  }
};
