import express from 'express';
import { generateRoadmap } from '../controllers/roadmapController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.post('/generate', auth, generateRoadmap);

export default router;
