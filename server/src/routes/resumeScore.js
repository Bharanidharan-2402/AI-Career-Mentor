import express from 'express';
import { scoreResume } from '../controllers/resumeScoreController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.post('/', auth, scoreResume);

export default router;
