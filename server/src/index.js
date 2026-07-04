import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import { initializeAI } from './services/aiClient.js';

dotenv.config();
initializeAI();

const PORT = process.env.PORT || 5000;

// Connect to DB without blocking server startup
connectDB().catch(() => {
  // Error already logged in connectDB
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
