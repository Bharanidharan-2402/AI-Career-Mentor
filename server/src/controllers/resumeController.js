import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { resumeAnalysisSchema } from '../utils/validators.js';
import { extractResumeText } from '../services/pdfService.js';
import resumeAnalyzerAgent from '../agents/resumeAnalyzerAgent.js';
import { getStoredUploadPath, resolveStoredUploadPath } from '../utils/serverPaths.js';

export const uploadResume = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: 'Resume file is required' } });
    }

    const uploadPath = getStoredUploadPath(req.file.filename);
    const createdResume = await Resume.create({ user: userId, fileName: req.file.originalname, filePath: uploadPath });

    const fileBuffer = await fs.promises.readFile(req.file.path);
    const text = await extractResumeText(fileBuffer, req.file.originalname, req.file.mimetype);
    const analysis = await resumeAnalyzerAgent(text);
    const profilePayload = {
      ...analysis,
      resume: {
        id: createdResume._id.toString(),
        fileName: req.file.originalname,
        filePath: uploadPath,
        uploadedAt: createdResume.uploadedAt,
        previewText: text,
        previewType: req.file.mimetype
      }
    };

    createdResume.analysis = analysis;
    await createdResume.save();
    await User.findByIdAndUpdate(userId, { aiProfile: profilePayload, resumeUploadedAt: new Date() });

    res.status(201).json({
      success: true,
      data: {
        message: 'Resume uploaded and analyzed successfully',
        resumeId: createdResume._id,
        filePath: uploadPath,
        analysis,
        previewText: text,
        previewType: req.file.mimetype,
        fileName: req.file.originalname
      }
    });
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

    const resolvedPath = resolveStoredUploadPath(resume.filePath);
    const fileBuffer = await fs.promises.readFile(resolvedPath);
    const text = await extractResumeText(fileBuffer, resume.fileName, 'application/octet-stream');
    const analysis = await resumeAnalyzerAgent(text);
    const profilePayload = {
      ...analysis,
      resume: {
        id: resume._id.toString(),
        fileName: resume.fileName,
        filePath: resume.filePath,
        uploadedAt: resume.uploadedAt,
        previewText: text,
        previewType: 'application/octet-stream'
      }
    };

    resume.analysis = analysis;
    await resume.save();
    await User.findByIdAndUpdate(userId, { aiProfile: profilePayload });

    res.json({ success: true, data: { resumeId, analysis: profilePayload, previewText: text, fileName: resume.fileName } });
  } catch (error) {
    next(error);
  }
};
