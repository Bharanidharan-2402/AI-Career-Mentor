# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (React/Vite)                │
│  (UI Components, Pages, Hooks, Auth Context, Tailwind CSS)  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST APIs
┌────────────────────────▼────────────────────────────────────┐
│              Backend Layer (Express.js)                      │
│  (Routes, Controllers, Middleware, Auth, Error Handling)    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Agent Layer (AI Services)                       │
│  (Planner, Resume Analyzer, Skill Gap, Roadmap, etc.)      │
│  (Uses Gemini API via LangGraph for orchestration)         │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Data Layer (MongoDB)                            │
│  (Users, Resumes, Skills, Roadmaps, Progress, etc.)        │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **User Login** → Auth Controller → JWT Token → Storage
2. **Resume Upload** → Multer → PDF Parser → Resume Analyzer Agent → Storage
3. **Skill Gap** → Controller → AI Agent → Analysis → Storage
4. **Roadmap Generation** → Controller → AI Agent → 30/60/90 Plans → Storage
5. **Interview** → Controller → AI Agent → Questions → Storage
6. **Chat** → Controller → AI Chat Agent → Response → Chat History

## AI Agent Orchestration

```
Planner Agent
    ↓
    ├─→ Resume Analyzer Agent (extracts skills/experience)
    ├─→ Skill Gap Agent (identifies missing skills)
    ├─→ Learning Roadmap Agent (generates 30/60/90 day plans)
    ├─→ Project Recommendation Agent (suggests projects)
    ├─→ Interview Coach Agent (generates questions)
    ├─→ Resume Improvement Agent (scores and improves resume)
    └─→ Progress Tracker Agent (recommends next steps)
```

## Frontend Architecture

- **React Router** for client-side routing
- **Context API + Hooks** for state management
- **Custom Hooks** (`useAuth`, `useResume`, `useCareerMentor`) for API calls
- **Tailwind CSS** for styling with responsive design
- **Framer Motion** for animations
- **Recharts** for data visualization (skill radar, progress charts)
- **React Hook Form** for form handling

## Backend Architecture

- **Express.js** for HTTP server and routing
- **MongoDB + Mongoose** for data persistence
- **JWT + bcrypt** for authentication and security
- **Multer** for file uploads
- **Winston** for logging
- **Zod** for runtime validation
- **Gemini API** for AI capabilities via LangGraph

## Security

- JWT tokens stored in localStorage (httpOnly preferred in production)
- Password hashing with bcrypt (12 rounds)
- CORS configured for allowed origins
- Rate limiting on all endpoints (80 requests/minute)
- Input validation with Zod schemas
- Helmet middleware for HTTP headers
- Environment variables for sensitive data

## Performance Considerations

- Indexed MongoDB queries on frequently searched fields (email, userId)
- Caching of AI responses for common prompts
- Lazy loading of frontend components
- Gzipped responses from backend
- CDN for static assets in production
- Connection pooling for database

## Error Handling

- Global error handler middleware in Express
- Centralized error logging with Winston
- Zod validation for request bodies
- Custom error classes with status codes
- Try-catch blocks with proper error propagation
