import express from 'express';
import { generateInterviewQuestions } from '../controllers/interviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.post('/questions', auth, generateInterviewQuestions);

export default router;
