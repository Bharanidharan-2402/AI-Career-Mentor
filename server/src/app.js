import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import skillsRoutes from './routes/skills.js';
import roadmapRoutes from './routes/roadmap.js';
import projectsRoutes from './routes/projects.js';
import interviewRoutes from './routes/interview.js';
import chatRoutes from './routes/chat.js';
import progressRoutes from './routes/progress.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));
app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Student Career Mentor Agent' });
});

app.use(errorHandler);

export default app;
