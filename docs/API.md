# API Documentation

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### POST /api/auth/register
Register a new user.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "careerGoal": "Software Engineer"
}
```

#### POST /api/auth/login
Login user and receive JWT token.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Resume

#### POST /api/resume/upload
Upload a PDF resume (multipart/form-data).

#### POST /api/resume/analyze
Analyze the uploaded resume.
```json
{
  "resumeId": "mongoObjectId"
}
```

### Skills

#### POST /api/skills/gap
Get skill gap analysis for a target role.
```json
{
  "targetRole": "Software Engineer"
}
```

### Roadmap

#### POST /api/roadmap/generate
Generate a 30/60/90 day learning roadmap.
```json
{
  "targetRole": "Software Engineer"
}
```

### Projects

#### POST /api/projects/recommend
Get project recommendations.
```json
{
  "targetRole": "Software Engineer",
  "skillLevel": "Intermediate"
}
```

### Interview

#### POST /api/interview/questions
Generate mock interview questions.
```json
{
  "targetRole": "Software Engineer",
  "interviewType": "Technical"
}
```

### Resume Score

#### POST /api/resume/score
Score a resume for ATS compatibility.
```json
{
  "resumeText": "Your resume text...",
  "targetRole": "Software Engineer"
}
```

### Chat

#### POST /api/chat
Chat with the AI mentor.
```json
{
  "message": "How can I improve my resume?"
}
```

### Progress

#### GET /api/progress
Get user progress.

#### PUT /api/progress
Update user progress.
```json
{
  "tasksCompleted": 5,
  "completedTopics": ["React", "JavaScript"],
  "projectsCompleted": ["todo-app"]
}
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "details": null
  }
}
```

## Success Responses

All success responses follow this format:
```json
{
  "success": true,
  "data": { ... }
}
```
