# ⚡ Quick Reference Card

Print this or keep it handy! 

---

## 🎯 Three Things You Must Do

### 1. MongoDB Atlas
```
https://www.mongodb.com/cloud/atlas
- Create account
- Create M0 cluster
- Create user: careermentor
- Get connection string
```

### 2. Gemini API Key
```
https://makersuite.google.com/app/apikey
- Sign in with Google
- Create API Key
- Copy the key
```

### 3. Update .env
```
Edit: server/.env
MONGO_URI=mongodb+srv://careermentor:PASSWORD@cluster0.xxx.mongodb.net/...
GEMINI_API_KEY=YOUR_KEY_HERE
```

---

## 🚀 Essential Commands

```bash
# Start backend
npm --prefix server run dev

# Start frontend
npm --prefix client run dev

# Run all tests
node server/tests/integration.test.js

# Or on Windows
run-tests.bat

# Health check
curl http://localhost:5000/api/health

# Install dependencies
npm install
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas |
| Gemini API | https://makersuite.google.com/app/apikey |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| QUICK_SETUP_CHECKLIST.md | Step-by-step checklist |
| SETUP_GUIDE.md | Detailed setup instructions |
| docs/MANUAL_TESTING.md | API testing with curl |
| server/.env | Configuration (UPDATE!) |
| server/tests/integration.test.js | Full test suite |

---

## ✅ Success Indicators

- [ ] Backend shows: "Server running on port 5000"
- [ ] Frontend loads at http://localhost:5173
- [ ] curl http://localhost:5000/api/health returns `{"status":"ok"}`
- [ ] Tests pass: `node server/tests/integration.test.js`
- [ ] Can register user in UI
- [ ] Can upload resume
- [ ] AI analysis works

---

## 🆘 If Something Breaks

**Backend won't start:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
npm --prefix server run dev
```

**Can't connect to MongoDB:**
- Check MONGO_URI in .env
- Wait 5-10 minutes after cluster creation
- Verify Network Access in MongoDB Atlas

**Gemini API not working:**
- Verify API key is correct
- Check free tier limits (60 req/min)

---

## 📖 Documentation

**Start Here:**
```
QUICK_SETUP_CHECKLIST.md → Follow checklist
↓
SETUP_GUIDE.md → Detailed instructions
↓
docs/MANUAL_TESTING.md → Test everything
```

---

## 💡 Pro Tips

1. **Save your tokens:**
   ```bash
   TOKEN="eyJhbGc..."
   curl -H "Authorization: Bearer $TOKEN" ...
   ```

2. **Pretty print JSON:**
   ```bash
   curl ... | jq '.'
   ```

3. **Generate JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Check open ports:**
   ```bash
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   netstat -ano | findstr :27017
   ```

---

## 🎯 Status Checklist

- [ ] Both servers running
- [ ] MongoDB Atlas configured
- [ ] Gemini API key obtained
- [ ] .env file updated
- [ ] Backend restarted
- [ ] Health check passes
- [ ] Tests pass
- [ ] User registration works
- [ ] Resume upload works
- [ ] AI analysis works

---

**Next:** Open [QUICK_SETUP_CHECKLIST.md](QUICK_SETUP_CHECKLIST.md)
