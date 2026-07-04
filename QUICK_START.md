# Quick Start Guide

Get the AI Student Career Mentor running in 5 minutes.

## Option 1: Docker (Recommended)

### Prerequisites
- Docker & Docker Compose installed

### Steps
```bash
# Clone and navigate
cd "Career Mentor"

# Copy environment template
cp server/.env.example server/.env

# Edit .env and add your GEMINI_API_KEY
# nano server/.env  # or use your favorite editor

# Start all services
docker compose up --build

# Open in browser
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

**Done!** The app is running. Test login with:
- Email: `student@mentor.app`
- Password: `mentor123`

---

## Option 2: Local Development

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)

### Steps
```bash
# Install dependencies
npm run install:all

# Setup environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and Gemini API key

# Optional: Start MongoDB (if using local)
mongod --dbpath <data-folder>

# Start dev servers (in separate terminals)
# Terminal 1:
npm --prefix server run dev

# Terminal 2:
npm --prefix client run dev

# Open http://localhost:5173
```

---

## First Steps

1. **Register** new account or login with test account
2. **Upload Resume** (PDF format)
3. **Analyze Resume** to see AI-powered insights
4. **Select Career Role** and get skill gap analysis
5. **Generate Roadmap** for your learning path
6. **Explore Projects**, interviews, and chat

---

## Key Features

✅ Resume Analysis & ATS Scoring  
✅ Skill Gap Detection  
✅ Personalized Learning Roadmaps (30/60/90 days)  
✅ Project Recommendations  
✅ Mock Interview Generator  
✅ AI Career Chat  
✅ Progress Tracking  

---

## Troubleshooting

### Port in use?
```bash
# Kill process on port 5000 or 5173
lsof -ti:5000 | xargs kill -9
```

### MongoDB not connecting?
- Check `MONGO_URI` in `server/.env`
- Ensure MongoDB is running
- For Atlas: whitelist your IP

### CORS error?
- Update `CLIENT_URL` in `server/.env`
- Restart backend: `npm --prefix server run dev`

### More help?
See `docs/SETUP.md` for detailed setup instructions.

---

## Documentation

- **Setup:** `docs/SETUP.md`
- **API Reference:** `docs/API.md`
- **Architecture:** `docs/ARCHITECTURE.md`
- **Deployment:** `docs/DEPLOYMENT.md`
- **AI Agents:** `docs/AI_AGENTS.md`
- **Database Schema:** `docs/DATABASE_SCHEMA.md`
- **Contributing:** `docs/CONTRIBUTING.md`

---

## Tech Stack

**Frontend:**
- React 18, Vite, Tailwind CSS, Framer Motion, Recharts

**Backend:**
- Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt

**AI:**
- Gemini API, LangGraph.js

**DevOps:**
- Docker, Docker Compose

---

## Environment Variables

Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentor-agent
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_gemini_key
CLIENT_URL=http://localhost:5173
LOG_LEVEL=info
```

---

## Next Steps

1. ✅ Get the app running (this guide)
2. 📖 Read `docs/SETUP.md` for deep setup
3. 🏗️ Check `docs/ARCHITECTURE.md` to understand structure
4. 🔧 Review `docs/API.md` for API endpoints
5. 🚀 Use `docs/DEPLOYMENT.md` to go live

---

**Happy coding! 🚀**
