import express from 'express';
import { generateInterviewQuestions, getInterviewQuestionDetail } from '../controllers/interviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.post('/questions', auth, generateInterviewQuestions);
router.post('/detail', auth, getInterviewQuestionDetail);

export default router;
