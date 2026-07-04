# Deployment Guide

## Docker Compose (Local & Development)

### Prerequisites
- Docker and Docker Compose installed
- `.env` file configured in `server/` directory

### Steps

1. Clone and navigate to project:
```bash
cd Career\ Mentor
```

2. Create environment file:
```bash
cp server/.env.example server/.env
```

3. Set your `GEMINI_API_KEY` in `server/.env`

4. Start services:
```bash
docker compose up --build
```

5. Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Stopping Services
```bash
docker compose down
```

## Production Deployment

### Using Docker

1. Build the image:
```bash
docker build -t mentor-app:latest .
```

2. Run the container:
```bash
docker run -d -p 5000:5000 \
  -e MONGO_URI=mongodb://mongo-host/mentor-agent \
  -e JWT_SECRET=your_secret \
  -e GEMINI_API_KEY=your_key \
  mentor-app:latest
```

### Using Cloud Platforms

#### AWS EC2
1. Launch Ubuntu 22.04 instance
2. Install Node.js and Docker
3. Clone repository and set environment variables
4. Run `docker compose up --build`

#### Heroku
```bash
heroku create mentor-app
git push heroku main
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Environment Variables for Production
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mentor-agent
JWT_SECRET=very_strong_secret_key
GEMINI_API_KEY=your_production_key
CLIENT_URL=https://yourdomain.com
LOG_LEVEL=info
NODE_ENV=production
```

### Database

#### MongoDB Atlas
1. Create a cluster at mongodb.com
2. Add IP whitelist
3. Get connection string
4. Set as `MONGO_URI` environment variable

#### Local MongoDB
```bash
mkdir -p data/db
mongod --dbpath data/db
```

### SSL Certificate

For production, use Let's Encrypt:
```bash
certbot certonly --standalone -d yourdomain.com
```

Configure nginx or reverse proxy to use certificate.

### Monitoring

- Use Winston logs in `server/config/logger.js`
- Monitor MongoDB performance
- Set up error tracking (e.g., Sentry)

### Scaling

- Use load balancer (nginx, HAProxy)
- Horizontal scaling with multiple instances
- Redis caching for sessions
- CDN for frontend static assets
