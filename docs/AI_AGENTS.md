# AI Agents Reference

## Overview

The application uses 8 specialized AI agents, each with a specific responsibility. They are orchestrated by the Planner Agent and powered by Gemini API via LangGraph.

## Agents

### 1. Planner Agent
**File:** `server/src/agents/plannerAgent.js`  
**Prompt:** `server/prompts/planner.txt`

**Purpose:** Understands user intent and decides which agents to invoke.

**Input:**
```javascript
{
  userGoal: "Improve resume for AI Engineer role",
  currentContext: { userId, careerGoal }
}
```

**Output:**
```javascript
{
  plannerIntent: "Comprehensive career guidance",
  agents: ["Resume Analyzer", "Skill Gap Agent", "Roadmap Agent"],
  reason: "User needs resume improvement and career planning",
  inputs: { /* for each agent */ }
}
```

**Usage:**
```javascript
import plannerAgent from '../agents/plannerAgent.js';
const plan = await plannerAgent({ userGoal: "...", ... });
```

---

### 2. Resume Analyzer Agent
**File:** `server/src/agents/resumeAnalyzerAgent.js`  
**Prompt:** `server/prompts/resumeAnalyzer.txt`

**Purpose:** Parses resume text and extracts structured profile data.

**Input:**
```javascript
{
  resumeText: "John Doe...\nSkills: React, Node.js...\n"
}
```

**Output:**
```javascript
{
  skills: ["React", "Node.js", "MongoDB"],
  education: [{ degree: "B.S.", field: "CS" }],
  experience: [{ title: "Developer", company: "TechCorp", years: 3 }],
  projects: [{ name: "Todo App", description: "..." }],
  certifications: ["AWS Certified"],
  achievements: ["Led team of 5"],
  summary: "Full-stack developer with 5+ years",
  contact: { email: "john@example.com", linkedin: "..." }
}
```

**Usage:**
```javascript
import resumeAnalyzerAgent from '../agents/resumeAnalyzerAgent.js';
const profile = await resumeAnalyzerAgent(resumeText);
```

---

### 3. Skill Gap Agent
**File:** `server/src/agents/skillGapAgent.js`  
**Prompt:** `server/prompts/skillGap.txt`

**Purpose:** Compares user's skills against a target role.

**Input:**
```javascript
{
  profile: { skills: ["React", "JavaScript"] },
  targetRole: "Full-Stack Developer"
}
```

**Output:**
```javascript
{
  targetRole: "Full-Stack Developer",
  currentSkills: ["React", "JavaScript"],
  missingSkills: ["Node.js", "MongoDB", "Docker"],
  priorityRecommendations: [
    "Learn Node.js (high priority, foundational)",
    "Master MongoDB (high priority, data layer)",
    "Docker & deployment (medium priority)"
  ]
}
```

**Usage:**
```javascript
import skillGapAgent from '../agents/skillGapAgent.js';
const gaps = await skillGapAgent(profile, "Software Engineer");
```

---

### 4. Learning Roadmap Agent
**File:** `server/src/agents/roadmapAgent.js`  
**Prompt:** `server/prompts/roadmap.txt`

**Purpose:** Generates 30/60/90 day learning plans.

**Input:**
```javascript
{
  profile: { skills: [...], experience: {...} },
  targetRole: "Backend Developer"
}
```

**Output:**
```javascript
{
  role: "Backend Developer",
  roadmaps: {
    "30": [
      "Week 1: Node.js Fundamentals (5hrs/week)",
      "Week 2: Express.js Deep Dive (5hrs/week)",
      "...",
      "Week 4: Mini-project: Build REST API (10hrs)"
    ],
    "60": [ /* 8 week plan */ ],
    "90": [ /* 12 week plan */ ]
  },
  resources: [
    { title: "Node.js Docs", url: "...", type: "documentation" },
    { title: "Backend Dev Bootcamp", url: "...", type: "course" }
  ],
  milestones: [
    { week: 2, milestone: "Complete Node.js course" },
    { week: 4, milestone: "Deploy first API" }
  ]
}
```

**Usage:**
```javascript
import roadmapAgent from '../agents/roadmapAgent.js';
const roadmap = await roadmapAgent(profile, "Backend Developer");
```

---

### 5. Project Recommendation Agent
**File:** `server/src/agents/projectRecommendationAgent.js`  
**Prompt:** `server/prompts/projects.txt`

**Purpose:** Suggests portfolio projects aligned with role and skill level.

**Input:**
```javascript
{
  profile: { skills: [...] },
  targetRole: "Frontend Developer",
  skillLevel: "Intermediate"
}
```

**Output:**
```javascript
[
  {
    title: "E-commerce Dashboard",
    description: "Build admin panel with product management",
    difficulty: "Intermediate",
    requiredSkills: ["React", "TypeScript", "Redux"],
    techStack: ["React", "Node.js", "MongoDB"],
    learningOutcomes: [
      "Master state management",
      "Learn deployment",
      "Build scalable UIs"
    ]
  },
  // ... more projects
]
```

**Usage:**
```javascript
import projectRecommendationAgent from '../agents/projectRecommendationAgent.js';
const projects = await projectRecommendationAgent(profile, "Frontend Developer", "Intermediate");
```

---

### 6. Interview Coach Agent
**File:** `server/src/agents/interviewAgent.js`  
**Prompt:** `server/prompts/interview.txt`

**Purpose:** Generates mock interview questions with ideal answers.

**Input:**
```javascript
{
  profile: { skills: [...], experience: {...} },
  targetRole: "Software Engineer"
}
```

**Output:**
```javascript
{
  role: "Software Engineer",
  interviewType: "Technical",
  questions: [
    {
      question: "What is the difference between var, let, and const in JavaScript?",
      category: "Technical",
      difficulty: "Beginner",
      idealAnswer: "var is function-scoped, let and const are block-scoped. const prevents reassignment...",
      hint: "Think about scope and reassignment"
    },
    {
      question: "Design a system for URL shortening service",
      category: "System Design",
      difficulty: "Advanced",
      idealAnswer: "Consider database, caching, API rate limiting, scalability...",
      hint: "Start with database schema"
    }
    // ... more questions
  ]
}
```

**Usage:**
```javascript
import interviewAgent from '../agents/interviewAgent.js';
const interview = await interviewAgent(profile, "Software Engineer");
```

---

### 7. Resume Improvement Agent
**File:** `server/src/agents/resumeImprovementAgent.js`  
**Prompt:** `server/prompts/resumeScore.txt`

**Purpose:** Scores resume and provides ATS optimization suggestions.

**Input:**
```javascript
{
  profile: { skills: [...] },
  resumeText: "...",
  targetRole: "Backend Developer"
}
```

**Output:**
```javascript
{
  score: 72,
  issues: [
    "Missing action verbs in bullet points",
    "Poor keyword density for target role",
    "Inconsistent formatting"
  ],
  keywords: ["API Design", "Database Optimization", "Microservices"],
  recommendations: [
    "Add technical skills section",
    "Include quantifiable achievements",
    "Use industry-specific keywords"
  ],
  rewrittenBullets: [
    "Old: 'Built a web application using Node.js'",
    "New: 'Architected and deployed scalable Node.js microservices serving 100K+ daily users'"
  ]
}
```

**Usage:**
```javascript
import resumeImprovementAgent from '../agents/resumeImprovementAgent.js';
const score = await resumeImprovementAgent(profile, resumeText, "Backend Developer");
```

---

### 8. Progress Tracker Agent
**File:** `server/src/agents/progressTrackerAgent.js`  
**Prompt:** `server/prompts/progressTracker.txt`

**Purpose:** Analyzes learning progress and recommends next steps.

**Input:**
```javascript
{
  progress: {
    tasksCompleted: 15,
    completedTopics: ["React", "JavaScript"],
    practiceHistory: [...],
    interviewPerformance: [{ role: "...", score: 75 }]
  },
  profile: { skills: [...] },
  targetRole: "Full-Stack Developer"
}
```

**Output:**
```javascript
{
  nextStep: "Start Node.js backend fundamentals",
  strengths: ["Strong React knowledge", "Good UI/UX understanding"],
  weaknesses: ["Backend experience lacking", "Database design needs work"],
  recommendations: [
    "Complete Node.js course (20 hours)",
    "Build 3 REST APIs",
    "Practice system design questions"
  ]
}
```

**Usage:**
```javascript
import progressTrackerAgent from '../agents/progressTrackerAgent.js';
const recommendation = await progressTrackerAgent(progress, profile, targetRole);
```

---

## Agent Orchestration

Agents are orchestrated through controllers:

```javascript
// In controller:
const planner = await plannerAgent(userContext);

// Execute planned agents:
const analysis = await resumeAnalyzerAgent(resumeText);
const gaps = await skillGapAgent(analysis, planner.targetRole);
const roadmap = await roadmapAgent(analysis, planner.targetRole);

// Return comprehensive result
res.json({ analysis, gaps, roadmap });
```

## Prompt Template Structure

All prompts follow this pattern:

```
[Role/Responsibility Description]

[Input Format]

[Output Requirements - JSON structure]

[Supported Options - if applicable]
```

Example:
```
You are the Skill Gap Agent. Compare skills and identify missing ones.

Input: { profile, targetRole }

Return JSON:
{
  targetRole: "",
  missingSkills: [],
  priorityRecommendations: []
}

Supported roles: Software Engineer, AI Engineer, ...
```

## Adding a New Agent

1. **Create the service:**
```javascript
// server/src/agents/newAgent.js
import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const newAgent = async (context) => {
  const prompt = await loadPrompt('newAgent.txt');
  const aiRaw = await generateAIResponse(prompt, context);
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('New agent returned invalid JSON');
  }
};

export default newAgent;
```

2. **Create the prompt:**
```
// server/prompts/newAgent.txt
You are the New Agent...
```

3. **Use in controller:**
```javascript
import newAgent from '../agents/newAgent.js';
const result = await newAgent(context);
```

## Error Handling

All agents should handle errors gracefully:

```javascript
try {
  const result = await someAgent(context);
  return result;
} catch (error) {
  logger.error('Agent failed', { error, context });
  throw new Error('Operation failed. Please try again.');
}
```

## Performance Tips

- Cache agent responses for common queries
- Batch multiple agents when possible
- Use streaming for long-running operations
- Implement retry logic for API failures
- Log all agent invocations for debugging
