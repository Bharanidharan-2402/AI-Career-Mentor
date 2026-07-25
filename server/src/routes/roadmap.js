import express from 'express';
import { generateRoadmap, getActiveRoadmap, selectPlan, toggleTask } from '../controllers/roadmapController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.post('/generate', auth, generateRoadmap);
router.get('/active', auth, getActiveRoadmap);
router.put('/select-plan', auth, selectPlan);
router.put('/toggle-task', auth, toggleTask);

export default router;
