# Complete Setup Guide

## 1️⃣ MongoDB Atlas Setup (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** or **"Sign Up"**
3. Create account with:
   - Email address
   - Password
   - Organization name: "Career Mentor"

### Step 2: Create a Cluster
1. After login, click **"Create a Deployment"**
2. Select **"M0 Free"** tier (free forever, perfect for development)
3. Choose your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Select region closest to you (e.g., us-east-1 for US)
5. Click **"Create Deployment"**
6. Wait 3-5 minutes for cluster to deploy

### Step 3: Set Up Database User
1. In the cluster page, click **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Enter:
   - Username: `careermentor`
   - Password: Generate a strong password (e.g., `SecurePass123!@#`)
   - **Save this password securely** ⚠️
4. Click **"Add User"**

### Step 4: Configure Network Access
1. Go to **"Security"** → **"Network Access"**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (for development only)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Databases"** → Click **"Connect"**
2. Choose **"Drivers"** → **"Node.js"**
3. Copy the connection string that looks like:
   ```
   mongodb+srv://careermentor:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **Replace `<password>` with your database user password**

---

## 2️⃣ Gemini API Key Setup

### Step 1: Get Your API Key
1. Go to https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the generated API key
4. **Keep this secure** ⚠️

### Step 2: Add to Your .env File
Update `server/.env` with your credentials:
```
PORT=5000
MONGO_URI=mongodb+srv://careermentor:<your-password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_this_in_production
GEMINI_API_KEY=your_generated_api_key_here
CLIENT_URL=http://localhost:5173
LOG_LEVEL=debug
NODE_ENV=development
```

---

## 3️⃣ Update Environment Variables

Edit `server/.env` and replace:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `GEMINI_API_KEY`: Your Google Gemini API key
- `JWT_SECRET`: A random secret (or keep default for development)

**After updating .env:**
1. Restart backend server: Kill terminal with `npm --prefix server run dev` and restart
2. Server will reconnect to MongoDB Atlas automatically

---

## 4️⃣ Verify Setup

The application is ready when:
- ✅ Backend runs on http://localhost:5000
- ✅ Frontend loads on http://localhost:5173
- ✅ Backend health check passes: `curl http://localhost:5000/api/health`
- ✅ MongoDB Atlas shows active connection in metrics

---

## Troubleshooting

### MongoDB Connection Issues
- **"Authentication failed"**: Check username/password in connection string
- **"Timeout"**: Check Network Access settings allow your IP
- **"Connection refused"**: Wait for cluster to fully deploy (5-10 minutes)

### Gemini API Issues
- **"Invalid API key"**: Regenerate key at makersuite.google.com/app/apikey
- **"Quota exceeded"**: Free tier has 60 requests/minute limit
- **"Model not found"**: Ensure key has access to gemini-pro model

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## Next Steps After Setup
1. Restart both dev servers
2. Open http://localhost:5173 in your browser
3. Register a new account
4. Upload a resume (PDF file)
5. Run AI analysis to test Gemini API integration
