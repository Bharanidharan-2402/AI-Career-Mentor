# Database Schema

## Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (default: 'student'),
  careerGoal: String (default: 'Software Engineer'),
  resumeUploadedAt: Date,
  createdAt: Date (default: now),
  aiProfile: Object (mixed)
}
```

## Resumes Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  fileName: String,
  filePath: String,
  uploadedAt: Date (default: now),
  analysis: Object (mixed) // Result from AI analysis
}
```

## SkillGaps Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  targetRole: String,
  identifiedGaps: Array<String>,
  recommendedSkills: Array<String>,
  generatedAt: Date (default: now)
}
```

## Roadmaps Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  role: String,
  periods: Array, // 30, 60, 90 day plans
  resources: Array, // Courses, docs, playlists
  milestones: Array,
  generatedAt: Date (default: now)
}
```

## ProjectRecommendations Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  role: String,
  skillLevel: String,
  recommendations: Array, // Project objects
  generatedAt: Date (default: now)
}
```

## InterviewHistories Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  interviewType: String,
  role: String,
  questions: Array,
  scores: Number,
  feedback: String,
  completedAt: Date (default: now)
}
```

## ChatHistories Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  role: String (default: 'Career Mentor'),
  messages: Array, // { role, text, createdAt }
  createdAt: Date (default: now)
}
```

## Progress Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  tasksCompleted: Number,
  totalTasks: Number,
  completedTopics: Array<String>,
  projectsCompleted: Array<String>,
  practiceHistory: Array, // { topic, result, date }
  interviewPerformance: Array, // { role, score, date }
  updatedAt: Date (default: now)
}
```

## Notifications Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  type: String (default: 'info'),
  title: String,
  message: String,
  read: Boolean (default: false),
  createdAt: Date (default: now)
}
```
