import request from 'supertest';
import app from '../src/app.js';

describe('Auth API', () => {
  it('should reject invalid login credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({ email: 'invalid@test.com', password: 'password123' });
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.service).toContain('AI Student Career Mentor Agent');
  });
});
