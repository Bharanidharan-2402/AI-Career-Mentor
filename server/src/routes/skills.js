import express from 'express';
import { generateSkillGap } from '../controllers/skillsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.post('/gap', auth, generateSkillGap);

export default router;
