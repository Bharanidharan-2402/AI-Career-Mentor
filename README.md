# AI Student Career Mentor Agent

A production-ready MERN stack application that acts as an agentic AI career mentor for students. The platform analyzes resumes, identifies skill gaps, generates personalized learning roadmaps, recommends projects, conducts mock interviews, and tracks progress.

## Features

- User registration and JWT authentication
- Resume upload and PDF parsing
- AI-driven resume analysis and ATS scoring
- Skill gap detection for target career roles
- 30/60/90 day learning roadmaps
- Project recommendations with outcomes and tech stacks
- Mock interview generation with ideal answers
- AI chat panel for career mentorship
- Progress tracking and recommendations
- Responsive SaaS-style UI built with React, Tailwind, and Framer Motion
- Docker and Docker Compose deployment

## Folder Structure

- `server/` - Express backend, routes, controllers, models, AI agent services
- `client/` - React frontend built with Vite and Tailwind CSS
- `server/prompts/` - AI prompt templates for each agent
- `server/uploads/` - Resume file storage
- `server/tests/` - Backend Jest and Supertest tests

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   npm run install:all
   ```

2. Create environment file:
   ```bash
   cp server/.env.example server/.env
   ```

3. Start MongoDB and app locally:
   ```bash
   docker compose up --build
   ```

4. Open the client at `http://localhost:5173`

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/resume/upload`
- `POST /api/resume/analyze`
- `POST /api/skills/gap`
- `POST /api/roadmap/generate`
- `POST /api/projects/recommend`
- `POST /api/interview/questions`
- `POST /api/resume/score`
- `POST /api/chat`
- `GET /api/progress`
- `PUT /api/progress`

## Environment Variables

- `PORT` - Server port (default 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GEMINI_API_KEY` - Gemini API key for AI generation
- `CLIENT_URL` - Allowed client origin
- `LOG_LEVEL` - Logger level

## Deployment

Use Docker Compose to start services:

```bash
docker compose up --build
```

## Testing

Run backend tests:

```bash
cd server
npm test
```

## Notes

- Add a valid `GEMINI_API_KEY` to `server/.env` for AI features.
- Ensure `server/uploads` exists and is writable for resume uploads.
