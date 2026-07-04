import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80,
  message: {
    success: false,
    error: { message: 'Too many requests from this IP, please try again later.' }
  }
});

export default rateLimiter;
