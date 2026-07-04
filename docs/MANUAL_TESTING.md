# Manual API Testing Guide

Use this guide to test individual API endpoints using curl commands.

## Quick Start

All examples use a base URL: `http://localhost:5000/api`

## 1️⃣ Health Check (No Auth Required)

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "AI Student Career Mentor Agent"
}
```

---

## 2️⃣ Authentication

### Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Developer",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "careerGoal": "Full Stack Developer"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Developer",
      "email": "john@example.com"
    }
  }
}
```

**Save the token:** You'll use this for all subsequent requests.

```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### Login

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }' | jq -r '.data.token')

echo $TOKEN
```

### Get Profile

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/profile
```

---

## 3️⃣ Resume Operations

### Upload Resume

```bash
# Create a sample resume file
cat > resume.txt << 'EOF'
JOHN DEVELOPER
Phone: (555) 123-4567 | Email: john@example.com

PROFESSIONAL SUMMARY
Full Stack Developer with 5 years of experience in JavaScript, React, and Node.js

SKILLS
- JavaScript, TypeScript, React, Vue.js
- Node.js, Express, MongoDB, PostgreSQL
- AWS, Docker, CI/CD pipelines

EXPERIENCE
Senior Developer at TechCorp (2022-Present)
- Led development of scalable web applications
- Mentored junior developers
- Reduced deployment time by 50%

EDUCATION
Bachelor of Science in Computer Science, 2019
EOF

# Upload the file
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@resume.txt"
```

**Response will include:**
```json
{
  "success": true,
  "data": {
    "message": "Resume uploaded successfully",
    "filePath": "uploads/filename.txt"
  }
}
```

**Save the resumeId from the response** (usually in MongoDB response).

### Analyze Resume

```bash
curl -X POST http://localhost:5000/api/resume/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeId": "507f1f77bcf86cd799439011"
  }'
```

---

## 4️⃣ Skills Analysis

### Analyze Skill Gaps

```bash
curl -X POST http://localhost:5000/api/skills/gap \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "JavaScript, React, Node.js, MongoDB, Git, AWS",
    "targetRole": "Senior Full Stack Developer",
    "targetSkills": "TypeScript, Kubernetes, GraphQL, System Design, microservices"
  }'
```

**Response includes:**
- Missing skills ranked by priority
- Recommended learning resources
- Estimated time to master each skill

---

## 5️⃣ Roadmap Generation

### Generate Learning Roadmap

```bash
curl -X POST http://localhost:5000/api/roadmap/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentRole": "Junior Developer",
    "targetRole": "Senior Full Stack Developer",
    "timeframe": 12
  }'
```

**Response includes:**
- 30-day plan
- 60-day plan  
- 90-day plan with specific milestones and resources

---

## 6️⃣ Project Recommendations

### Get Project Ideas

```bash
curl -X POST http://localhost:5000/api/projects/recommend \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skillLevel": "intermediate",
    "interests": ["web development", "AI", "mobile apps"]
  }'
```

**Response includes:**
- Project title and description
- Required tech stack
- Difficulty level
- Learning outcomes

---

## 7️⃣ Interview Preparation

### Generate Interview Questions

```bash
curl -X POST http://localhost:5000/api/interview/questions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Full Stack Developer",
    "level": "senior",
    "count": 5
  }'
```

**Response includes:**
- 5 randomly selected interview questions
- Question categories (technical, behavioral, system design, etc.)
- Ideal answer outlines
- Tips for better responses

---

## 8️⃣ AI Chat

### Chat with Mentor

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the best ways to learn TypeScript quickly?"
  }'
```

**Response includes:**
- AI-generated personalized advice
- Relevant resources and links
- Next steps

---

## 9️⃣ Progress Tracking

### Get Progress

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/progress
```

### Update Progress

```bash
curl -X PUT http://localhost:5000/api/progress \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tasksCompleted": 5,
    "projectsBuilt": 2,
    "articlesRead": 10
  }'
```

---

## 🧪 Batch Testing Script

Save this as `test-all.sh` (Linux/Mac) or `test-all.bat` (Windows):

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "1. Health Check"
curl $BASE_URL/health
echo -e "\n"

echo "2. Register User"
RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "TestPass123!"
  }')
echo $RESPONSE
TOKEN=$(echo $RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"
echo -e "\n"

echo "3. Get Profile"
curl -H "Authorization: Bearer $TOKEN" $BASE_URL/auth/profile
echo -e "\n"

echo "4. Chat with Mentor"
curl -X POST $BASE_URL/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I learn React?"}'
echo -e "\n"
```

Run with:
```bash
bash test-all.sh
```

---

## 📊 Common Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET /profile |
| 201 | Created | POST /auth/register |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Missing/invalid token |
| 404 | Not Found | Invalid resource ID |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Database connection failed |

---

## 🔐 Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "User already exists",
    "code": "USER_EXISTS"
  }
}
```

---

## 💡 Tips

1. **Save Token to Variable:**
   ```bash
   TOKEN="your_token_here"
   
   # Use in requests:
   curl -H "Authorization: Bearer $TOKEN" ...
   ```

2. **Pretty Print JSON:**
   ```bash
   curl ... | jq '.'
   ```

3. **Save Response to File:**
   ```bash
   curl ... > response.json
   ```

4. **View Response Headers:**
   ```bash
   curl -i ...
   ```

5. **Debug with Verbose Output:**
   ```bash
   curl -v ...
   ```

---

## 🚀 Next Steps

1. Test each endpoint individually
2. Verify AI responses make sense
3. Check database has data in MongoDB Atlas
4. Monitor backend console for errors
5. Run full integration test: `node server/tests/integration.test.js`

Happy testing! 🎉
