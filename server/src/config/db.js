import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000
    });

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.warn('MongoDB connection failed', { error: error.message });
    logger.warn('Running in offline mode. Database operations will not work.');
  }
};

export default connectDB;
