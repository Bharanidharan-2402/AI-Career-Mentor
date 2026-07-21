import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import auth from '../middleware/auth.js';
import { serverRoot } from '../utils/serverPaths.js';
import { uploadPhoto, getProfile } from '../controllers/profileController.js';

const router = express.Router();
const uploadDir = path.join(serverRoot, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${sanitized}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/photo', auth, upload.single('photo'), uploadPhoto);
router.get('/', auth, getProfile);

export default router;
