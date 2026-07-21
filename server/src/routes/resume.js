import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { uploadResume, analyzeResume } from '../controllers/resumeController.js';
import auth from '../middleware/auth.js';
import { serverRoot } from '../utils/serverPaths.js';
import { isResumeFileAccepted } from '../utils/resumeUpload.js';

const router = express.Router();
const uploadDir = path.join(serverRoot, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!isResumeFileAccepted(file)) {
      cb(new Error('Only PDF, PNG, JPG, JPEG, and DOCX resumes are accepted'));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/upload', auth, upload.single('resume'), uploadResume);
router.post('/analyze', auth, analyzeResume);

export default router;
