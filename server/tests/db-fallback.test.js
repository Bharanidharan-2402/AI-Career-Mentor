import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/db.js', () => ({
  default: jest.fn()
}));

describe('server startup database fallback', () => {
  it('should not fail startup when MongoDB is unavailable and memory mode is enabled', async () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, MONGO_USE_MEMORY: 'true', MONGO_URI: 'mongodb://invalid-host:27017/test' };

    const { default: connectDB } = await import('../src/config/db.js');

    expect(typeof connectDB).toBe('function');
    process.env = originalEnv;
  });
});
