import express from 'express';
import { register, login, googleAuth, me } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', auth, me);

export default router;
