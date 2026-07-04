import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  careerGoal: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const uploadSchema = z.object({
  resumeId: z.string().optional()
});

export const resumeAnalysisSchema = z.object({
  resumeId: z.string().min(1)
});

export const skillGapSchema = z.object({
  targetRole: z.string().min(3)
});

export const roadmapSchema = z.object({
  targetRole: z.string().min(3)
});

export const projectSchema = z.object({
  targetRole: z.string().min(3),
  skillLevel: z.string().min(3)
});

export const interviewSchema = z.object({
  targetRole: z.string().min(3),
  interviewType: z.string().min(3)
});

export const resumeScoreSchema = z.object({
  resumeText: z.string().min(20),
  targetRole: z.string().min(3)
});

export const chatSchema = z.object({
  message: z.string().min(1)
});

export const progressSchema = z.object({
  tasksCompleted: z.number().nonnegative().optional(),
  totalTasks: z.number().nonnegative().optional(),
  completedTopics: z.array(z.string()).optional(),
  projectsCompleted: z.array(z.string()).optional(),
  practiceHistory: z.array(z.object({
    topic: z.string(),
    result: z.string(),
    date: z.string()
  })).optional(),
  interviewPerformance: z.array(z.object({
    role: z.string(),
    score: z.number().min(0).max(100),
    date: z.string()
  })).optional()
});
