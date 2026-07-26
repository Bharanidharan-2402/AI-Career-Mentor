import express from 'express';
import {
  generateSkillGap,
  generateSkillRoadmap,
  getUserLearningPlans,
  toggleLearningTask,
  updatePlanStatus
} from '../controllers/skillsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/gap', auth, generateSkillGap);
router.post('/learning-plan', auth, generateSkillRoadmap);
router.get('/learning-plans', auth, getUserLearningPlans);
router.put('/learning-plan/toggle', auth, toggleLearningTask);
router.put('/learning-plan/status', auth, updatePlanStatus);

export default router;
