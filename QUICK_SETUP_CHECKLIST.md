# 🚀 Quick Setup Checklist

Use this checklist to complete your setup in order.

## Phase 1: Prerequisites (5 minutes)

- [ ] Node.js v20+ installed (`node --version`)
- [ ] npm v10+ installed (`npm --version`)
- [ ] Git installed (for version control)
- [ ] Both dev servers running:
  - [ ] Backend: `npm --prefix server run dev` (should show: "Server running on port 5000")
  - [ ] Frontend: `npm --prefix client run dev` (should show: "Local: http://localhost:5173")

## Phase 2: Database Setup (MongoDB Atlas) - 10 minutes

- [ ] Visit https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create M0 free cluster
- [ ] Create database user:
  - [ ] Username: `careermentor`
  - [ ] Password: (generate strong password)
  - [ ] Save password securely
- [ ] Configure Network Access:
  - [ ] Allow access from anywhere (for development)
- [ ] Get connection string:
  - [ ] Click "Connect" → "Drivers" → "Node.js"
  - [ ] Copy connection string
  - [ ] **Replace `<password>` with your database password**

**Your Connection String Should Look Like:**
```
mongodb+srv://careermentor:YOUR_PASSWORD@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

## Phase 3: Google Gemini API Setup - 5 minutes

- [ ] Visit https://makersuite.google.com/app/apikey
- [ ] Sign in with Google account (or create one)
- [ ] Click "Create API Key"
- [ ] Copy the generated API key
- [ ] **Keep this secret!** ⚠️

## Phase 4: Configure Environment Variables - 2 minutes

- [ ] Open `server/.env` (already created)
- [ ] Update these 2 fields:
  ```
  MONGO_URI=mongodb+srv://careermentor:YOUR_PASSWORD@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
  GEMINI_API_KEY=YOUR_API_KEY_HERE
  ```
- [ ] **Do NOT commit .env to git** (already in .gitignore)
- [ ] Save file

## Phase 5: Restart Servers - 2 minutes

- [ ] Stop backend server (Ctrl+C in terminal)
- [ ] Wait 2 seconds
- [ ] Restart: `npm --prefix server run dev`
- [ ] Watch for success: `Server running on port 5000`
- [ ] Frontend should continue running on http://localhost:5173

## Phase 6: Run Integration Tests - 5 minutes

**Option A: Automated Tests**
```bash
node server/tests/integration.test.js
```

**Option B: Windows Batch File**
```bash
run-tests.bat
```

**Option C: Manual Tests via curl**
```bash
# Test health
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

---

## ✅ Success Indicators

When properly configured, you should see:

1. **Backend Console Output:**
   ```
   info: Server running on port 5000
   info: MongoDB connected successfully
   ```

2. **Frontend Loading:**
   - http://localhost:5173 loads without errors
   - No red errors in browser console

3. **Test Results:**
   ```
   ✓ Health Check
   ✓ User Registration
   ✓ User Login
   ✓ Skill Gap Analysis
   ✓ Generate Learning Roadmap
   ... (all tests pass)
   ```

---

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check if ports are in use
netstat -ano | findstr :5000

# Kill process on port 5000
taskkill /PID <PID> /F

# Restart
npm --prefix server run dev
```

### MongoDB Connection Failed
- ✓ Check username/password in .env MONGO_URI
- ✓ Verify Network Access allows your IP in MongoDB Atlas
- ✓ Wait 5-10 minutes for cluster to fully deploy
- ✓ Check internet connection

### Gemini API Not Working
- ✓ Verify API key is correct at https://makersuite.google.com/app/apikey
- ✓ Check free tier limit (60 requests/minute)
- ✓ Ensure model name is "gemini-pro"

### Tests Failing
1. Check both servers are running
2. Verify .env file has been updated
3. Check backend console for error messages
4. Verify database credentials are correct

---

## 📝 Next Steps After Setup

1. **Use the Application:**
   - Open http://localhost:5173
   - Register a new account
   - Upload a sample resume (PDF)
   - Run AI analysis

2. **Explore Features:**
   - Skill gap analysis
   - Learning roadmap generation
   - Interview question generator
   - Career progression tracker

3. **Production Deployment:**
   - See [DEPLOYMENT.md](docs/DEPLOYMENT.md)
   - Use Docker: `docker-compose up --build`
   - Deploy to AWS/Heroku/DigitalOcean

---

## 📞 Support

For detailed information, see:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed step-by-step instructions
- [docs/API.md](docs/API.md) - API endpoint documentation
- [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) - Database structure
- [docs/AI_AGENTS.md](docs/AI_AGENTS.md) - AI agent specifications

---

**Status:** Ready for setup! Follow the checklist above. ✨
