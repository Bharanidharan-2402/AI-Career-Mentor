import express from 'express';
import { recommendProjects } from '../controllers/projectsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.post('/recommend', auth, recommendProjects);

export default router;
