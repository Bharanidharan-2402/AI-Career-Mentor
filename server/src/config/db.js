import dns from 'dns';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import logger from './logger.js';

const configureDns = () => {
  const servers = process.env.DNS_SERVERS
    ?.split(',')
    .map((server) => server.trim())
    .filter(Boolean) || ['8.8.8.8', '8.8.4.4'];

  try {
    dns.setServers(servers);
    logger.info(`DNS servers configured: ${servers.join(', ')}`);
  } catch (error) {
    logger.warn('Unable to configure custom DNS servers', { error: error.message });
  }
};

configureDns();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const useMemory = process.env.MONGO_USE_MEMORY === 'true';

  if (!uri && !useMemory) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  if (useMemory) {
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000
      });
      logger.info('MongoDB connected successfully using in-memory server');
      return;
    } catch (error) {
      logger.warn('In-memory MongoDB fallback failed, attempting Atlas connection', { error: error.message });
    }
  }

  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000
    });

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    throw error;
  }
};

export default connectDB;
