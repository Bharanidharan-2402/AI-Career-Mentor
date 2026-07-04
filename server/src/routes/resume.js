import express from 'express';
import multer from 'multer';
import { uploadResume, analyzeResume } from '../controllers/resumeController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'server/uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF resumes are accepted'));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/upload', auth, upload.single('resume'), uploadResume);
router.post('/analyze', auth, analyzeResume);

export default router;
