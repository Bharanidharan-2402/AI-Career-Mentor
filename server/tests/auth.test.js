import request from 'supertest';
import app from '../src/app.js';
import connectDB from '../src/config/db.js';

describe('Auth API', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await import('mongoose').then(({ default: mongoose }) => mongoose.disconnect());
  });
  it('should reject invalid login credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({ email: 'invalid@test.com', password: 'password123' });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should return a helpful error when Google OAuth is not configured', async () => {
    const response = await request(app).post('/api/auth/google').send({
      code: 'sample-code',
      redirectUri: 'http://localhost:5173/auth/google/callback'
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body?.service).toContain('AI Student Career Mentor Agent');
  });
});
