
## 🌟 Overview

**AI Career Mentor** is a production-ready Agentic AI MERN stack application designed to act as your personal career coach. By leveraging Google's Gemini AI, the platform acts as an orchestra of specialized AI agents that analyze your resume, detect skill gaps for your target roles, recommend projects, conduct mock interviews, and track your learning progress.

---

## ✨ Key Features

- **🔐 Authentication:** Secure email/password login and Google OAuth integration.
- **📄 Resume Analysis:** Upload your PDF or DOCX resume to get it parsed and analyzed for an ATS score.
- **🎯 Skill Gap Detection:** Compare your current skills against your target career role to find what you're missing.
- **🗺️ Learning Roadmaps:** Get automated, personalized 30/60/90-day actionable roadmaps.
- **💻 Project Recommendations:** AI-generated project ideas with tech stacks tailored to your skill gaps.
- **🎙️ Mock Interviews:** Generate custom technical and behavioral interview questions based on your profile.
- **💬 AI Chat Mentor:** A conversational AI assistant ready to answer any career or technical questions.
- **📊 Progress Tracking:** Keep track of your completed roadmap tasks and projects in an intuitive dashboard.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS & Framer Motion (Styling and Animations)
- React Hook Form (Form state management)
- React Router (Routing)
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Google Generative AI SDK (Gemini 1.5 Flash)
- JWT (JSON Web Tokens)
- Multer & PDF.js (File uploads and parsing)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas cluster)
- A Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/your-username/AI-Career-Mentor.git
cd AI-Career-Mentor
```

### 2. Environment Variables Setup
Create `.env` files for both the client and server.

**Server (`server/.env`):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id (Optional)
```

### 3. Install Dependencies & Run

You can run the application using Docker or manually.

**Option A: Using Docker (Recommended)**
```bash
docker compose up --build
```

**Option B: Manual Setup**
Open two terminal windows:

Terminal 1 (Backend):
```bash
cd server
npm install
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```text
📦 AI-Career-Mentor
 ┣ 📂 client                 # Frontend React Application
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components         # Reusable UI components
 ┃ ┃ ┣ 📂 pages              # Route pages (Dashboard, Profile, etc.)
 ┃ ┃ ┣ 📂 contexts           # React Context for state management
 ┃ ┃ ┗ 📂 hooks              # Custom React hooks
 ┣ 📂 server                 # Backend Express Application
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 agents             # AI prompt orchestrators
 ┃ ┃ ┣ 📂 controllers        # Route logic and request handling
 ┃ ┃ ┣ 📂 models             # MongoDB schemas
 ┃ ┃ ┣ 📂 routes             # Express API routes
 ┃ ┃ ┗ 📂 services           # External API services (Gemini, PDF parser)
 ┃ ┗ 📂 prompts              # System prompt templates (.txt)
 ┗ 📜 docker-compose.yml     # Docker configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/your-username/AI-Career-Mentor/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
