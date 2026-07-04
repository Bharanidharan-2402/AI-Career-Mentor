import express from 'express';
import { getProgress, updateProgress } from '../controllers/progressController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.get('/', auth, getProgress);
router.put('/', auth, updateProgress);

export default router;
