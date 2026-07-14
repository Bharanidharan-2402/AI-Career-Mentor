import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import { initializeAI } from './services/aiClient.js';

dotenv.config();
initializeAI();

const validateEnvironment = () => {
  if (!process.env.MONGO_URI) {
    throw new Error('Missing environment variable: MONGO_URI');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing environment variable: JWT_SECRET');
  }
};

const startServer = async () => {
  validateEnvironment();
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  logger.error('Server startup failed', { error: error.message });
  process.exit(1);
});
