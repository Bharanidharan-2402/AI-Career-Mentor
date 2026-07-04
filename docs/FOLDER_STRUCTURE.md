# Project Folder Structure

## Root Structure

```
Career Mentor/
├── server/                  # Backend Express.js application
├── client/                  # Frontend React/Vite application
├── docs/                    # Documentation files
├── package.json             # Root workspace package
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Docker image for server
└── README.md               # Main project README
```

## Server Structure

```
server/
├── src/
│   ├── index.js             # Application entry point
│   ├── app.js               # Express app configuration
│   ├── config/
│   │   ├── db.js            # MongoDB connection setup
│   │   └── logger.js        # Winston logger configuration
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication middleware
│   │   ├── errorHandler.js  # Global error handler
│   │   └── rateLimiter.js   # Rate limiting middleware
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Resume.js        # Resume schema
│   │   ├── SkillGap.js      # Skill gap analysis schema
│   │   ├── Roadmap.js       # Learning roadmap schema
│   │   ├── ProjectRecommendation.js
│   │   ├── InterviewHistory.js
│   │   ├── ChatHistory.js
│   │   ├── Progress.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints
│   │   ├── resume.js        # Resume endpoints
│   │   ├── skills.js        # Skill gap endpoints
│   │   ├── roadmap.js       # Roadmap endpoints
│   │   ├── projects.js      # Project endpoints
│   │   ├── interview.js     # Interview endpoints
│   │   ├── chat.js          # Chat endpoints
│   │   └── progress.js      # Progress endpoints
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── skillsController.js
│   │   ├── roadmapController.js
│   │   ├── projectsController.js
│   │   ├── interviewController.js
│   │   ├── chatController.js
│   │   ├── resumeScoreController.js
│   │   └── progressController.js
│   ├── services/
│   │   ├── aiClient.js      # Gemini API client
│   │   └── pdfService.js    # PDF parsing service
│   ├── agents/
│   │   ├── plannerAgent.js
│   │   ├── resumeAnalyzerAgent.js
│   │   ├── skillGapAgent.js
│   │   ├── roadmapAgent.js
│   │   ├── projectRecommendationAgent.js
│   │   ├── interviewAgent.js
│   │   ├── resumeImprovementAgent.js
│   │   └── progressTrackerAgent.js
│   ├── utils/
│   │   ├── validators.js    # Zod schemas for validation
│   │   ├── errorHandler.js  # Error handling utilities
│   │   ├── seed.js          # Database seeding script
│   │   └── careerRoles.js   # Career role definitions
│   ├── prompts/
│   │   ├── planner.txt
│   │   ├── resumeAnalyzer.txt
│   │   ├── skillGap.txt
│   │   ├── roadmap.txt
│   │   ├── projects.txt
│   │   ├── interview.txt
│   │   ├── resumeScore.txt
│   │   └── progressTracker.txt
│   ├── uploads/             # Resume file uploads directory
│   └── tests/
│       └── auth.test.js     # Jest test suite
├── .env.example             # Environment variables template
├── .eslintrc.js             # ESLint configuration
├── jest.config.js           # Jest configuration
└── package.json             # Backend dependencies
```

## Client Structure

```
client/
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx              # Root component with routing
│   ├── index.css            # Global styles + Tailwind
│   ├── components/
│   │   ├── Layout.jsx       # Main layout wrapper
│   │   └── UI.jsx           # Reusable UI components
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UploadResumePage.jsx
│   │   ├── SkillAnalysisPage.jsx
│   │   ├── RoadmapPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── InterviewPage.jsx
│   │   ├── ResumeScorePage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── ChatPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js       # Authentication hook
│   │   ├── useResume.js     # Resume operations hook
│   │   └── useCareerMentor.js # AI mentor features hook
│   ├── contexts/
│   │   └── AuthContext.jsx  # Auth context provider
│   ├── api/
│   │   └── apiClient.js     # Axios API client with interceptors
│   ├── utils/
│   │   └── auth.js          # Token and profile storage
│   ├── assets/              # Images, fonts, etc.
│   └── data/                # Static data files
├── index.html               # HTML entry
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config
├── .eslintrc.js             # ESLint configuration
├── .env.example             # Environment variables template
└── package.json             # Frontend dependencies
```

## Documentation Structure

```
docs/
├── README.md                # Project overview
├── API.md                   # API endpoint documentation
├── DATABASE_SCHEMA.md       # MongoDB collections schema
├── ARCHITECTURE.md          # System architecture
├── DEPLOYMENT.md            # Deployment guide
└── FOLDER_STRUCTURE.md      # This file
```

## File Purpose Reference

### Backend Key Files

- `index.js` - Server startup, DB connection
- `app.js` - Express app setup, middleware registration
- `config/db.js` - MongoDB Mongoose connection
- `middleware/auth.js` - JWT verification
- `models/` - All MongoDB schemas
- `agents/` - AI service implementations
- `prompts/` - AI prompt templates (not hardcoded)
- `utils/validators.js` - Zod schema validation rules

### Frontend Key Files

- `main.jsx` - React DOM mount
- `App.jsx` - Route definitions
- `hooks/` - Data fetching and state logic
- `contexts/` - Global state (auth)
- `api/apiClient.js` - Axios setup with auth interceptors
- `tailwind.config.js` - Tailwind color/theme extensions

### Both

- `.env.example` - Template for environment variables
- `.eslintrc.js` - Code style rules
- `package.json` - Dependencies and scripts
