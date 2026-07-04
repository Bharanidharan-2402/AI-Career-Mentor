# Setup & Installation Guide

## Prerequisites

- Node.js 20+ (https://nodejs.org/)
- MongoDB (local or cloud: MongoDB Atlas)
- Docker & Docker Compose (optional, for containerized setup)
- Git
- Gemini API key (https://makersuite.google.com/)

## Local Development Setup

### Step 1: Clone Repository
```bash
git clone <repo-url>
cd "Career Mentor"
```

### Step 2: Install Dependencies
```bash
npm run install:all
```

This installs dependencies for root, server, and client.

### Step 3: Configure Environment

**Server setup:**
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentor-agent
JWT_SECRET=your_super_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
LOG_LEVEL=info
```

**Client setup (optional):**
```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
# Ensure MongoDB is installed and running
mongod --dbpath <path-to-data-folder>
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `server/.env`

### Step 5: Start Development Servers

**Option A: Using npm concurrently (root)**
```bash
npm run dev
```

This starts both server and client.

**Option B: Manual (separate terminals)**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### Step 6: Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Docker Setup

### Prerequisites
- Docker & Docker Compose installed

### Steps

```bash
# Navigate to project root
cd "Career Mentor"

# Create .env file
cp server/.env.example server/.env

# Update GEMINI_API_KEY in server/.env

# Build and start containers
docker compose up --build

# First time: seed database (in another terminal)
docker compose exec server npm run seed
```

Access at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Stop Containers
```bash
docker compose down
```

### Rebuild After Changes
```bash
docker compose up --build
```

## Database Initialization

### Option 1: Auto-seed with sample data
```bash
npm --prefix server run seed
```

Creates a test user:
- Email: `student@mentor.app`
- Password: `mentor123`

### Option 2: Manual MongoDB Setup

Connect to MongoDB:
```bash
mongosh
use mentor-agent
db.users.insertOne({ name: "Test", email: "test@test.com", ... })
```

## Verify Installation

### Backend Health
```bash
curl http://localhost:5000/api/health
# Expected: { "status": "ok", "service": "AI Student Career Mentor Agent" }
```

### Frontend Load
Open http://localhost:5173 in browser

## Configuration Checklist

- [ ] MongoDB connection working
- [ ] JWT secret configured
- [ ] Gemini API key set
- [ ] Frontend proxying to backend
- [ ] Node version 20+
- [ ] All npm dependencies installed
- [ ] .env files in place

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- For Atlas: whitelist your IP

### API Not Responding
- Check server logs: `npm run dev` in server directory
- Verify `PORT` and `MONGO_URI` in `server/.env`
- Check rate limiter isn't blocking requests

### CORS Issues
- Update `CLIENT_URL` in `server/.env`
- Restart server after changes

## Next Steps

1. **Review API docs**: See `docs/API.md`
2. **Explore agents**: Check `server/src/agents/`
3. **Check prompts**: Review `server/prompts/`
4. **Run tests**: `npm --prefix server run test`
5. **Read architecture**: See `docs/ARCHITECTURE.md`

## Production Deployment

See `docs/DEPLOYMENT.md` for complete deployment instructions.
