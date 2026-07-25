import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/apiClient.js';
import { useResume } from '../contexts/ResumeContext.jsx';
import { getUserProfile } from '../utils/auth.js';

/* ─── Premium Loading Overlay ─── */
const GeneratingOverlay = ({ text = 'Building your personalized roadmap…' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className='card-glass flex flex-col items-center justify-center py-20'
  >
    <div className='relative mb-8' style={{ width: 100, height: 100 }}>
      <div className='loading-pulse-ring' style={{ width: 100, height: 100, top: 0, left: 0 }} />
      <div className='loading-pulse-ring' style={{ width: 70, height: 70, top: 15, left: 15, animationDelay: '0.5s' }} />
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow'>
          <svg className='h-6 w-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z' />
          </svg>
        </div>
      </div>
      <div className='loading-orbit-dot bg-indigo-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }} />
      <div className='loading-orbit-dot bg-violet-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4, animationDelay: '-0.8s' }} />
      <div className='loading-orbit-dot bg-purple-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4, animationDelay: '-1.6s' }} />
    </div>

    <p className='loading-shimmer-text text-lg font-semibold'>{text}</p>
    <p className='mt-2 text-sm text-slate-500'>AI is analyzing your skills and crafting a learning path…</p>

    <div className='mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-surface-300'>
      <div className='loading-progress-bar h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500' />
    </div>
  </motion.div>
);

/* ─── Helper: extract task text from task object or string ─── */
const getTaskText = (task) => {
  if (typeof task === 'string') return task;
  if (typeof task === 'object' && task !== null) return task.task || task.title || task.description || '';
  return String(task);
};

const getTaskUrl = (task) => {
  if (typeof task === 'object' && task !== null) return task.resourceUrl || task.resource_url || task.url || '';
  return '';
};

const getTaskLabel = (task) => {
  if (typeof task === 'object' && task !== null) return task.resourceLabel || task.resource_label || task.label || '';
  return '';
};

/* ─── Plan Selection Card ─── */
const PlanCard = ({ period, tasks, isSelected, onSelect, completedCount }) => {
  const labels = { '30': '30-Day Sprint', '60': '60-Day Journey', '90': '90-Day Mastery' };
  const descriptions = {
    '30': 'Fast-track the fundamentals',
    '60': 'Build depth and projects',
    '90': 'Complete career transformation'
  };
  const gradients = {
    '30': 'from-emerald-500/20 to-teal-500/10',
    '60': 'from-indigo-500/20 to-violet-500/10',
    '90': 'from-amber-500/20 to-orange-500/10'
  };
  const borderColors = {
    '30': 'border-emerald-500/30',
    '60': 'border-indigo-500/30',
    '90': 'border-amber-500/30'
  };
  const accentColors = {
    '30': 'text-emerald-400',
    '60': 'text-accent-light',
    '90': 'text-amber-400'
  };

  const taskCount = tasks?.length || 0;

  return (
    <motion.button
      type='button'
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`card-glass text-left transition-all duration-300 cursor-pointer w-full ${
        isSelected
          ? `!border-accent/50 shadow-glow-lg ring-2 ring-accent/20`
          : `hover:shadow-glow ${borderColors[period]}`
      }`}
    >
      <div className={`inline-flex rounded-lg bg-gradient-to-br ${gradients[period]} px-3 py-1.5 text-xs font-bold uppercase tracking-widest ${accentColors[period]} mb-3`}>
        {labels[period]}
      </div>
      <p className='text-sm text-slate-400 mb-4'>{descriptions[period]}</p>
      <div className='flex items-center justify-between'>
        <span className='text-xs text-slate-500'>{taskCount} tasks</span>
        {isSelected && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='flex items-center gap-1.5'>
            <div className='h-2 w-2 rounded-full bg-accent animate-pulse' />
            <span className='text-xs font-semibold text-accent-light'>Active</span>
          </motion.div>
        )}
        {!isSelected && completedCount > 0 && (
          <span className='text-xs text-slate-500'>{completedCount}/{taskCount} done</span>
        )}
      </div>
    </motion.button>
  );
};

/* ─── Learning Tracker with Resource Links ─── */
const LearningTracker = ({ tasks, completedTasks, onToggle, plan }) => {
  const completed = completedTasks || [];
  const total = tasks?.length || 0;
  const doneCount = completed.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const planLabels = { '30': '30-Day Sprint', '60': '60-Day Journey', '90': '90-Day Mastery' };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-5'>
      {/* Progress Header */}
      <div className='card-glass'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='text-lg font-semibold text-white'>{planLabels[plan]} Tracker</h3>
            <p className='text-sm text-slate-400 mt-1'>{doneCount} of {total} tasks completed</p>
          </div>
          <div className='relative flex h-16 w-16 items-center justify-center'>
            <svg className='h-16 w-16 -rotate-90' viewBox='0 0 64 64'>
              <circle cx='32' cy='32' r='28' fill='none' stroke='rgba(99,102,241,0.1)' strokeWidth='4' />
              <circle
                cx='32' cy='32' r='28' fill='none'
                stroke='url(#progress-gradient)'
                strokeWidth='4'
                strokeLinecap='round'
                strokeDasharray={`${percent * 1.759} 175.9`}
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
              <defs>
                <linearGradient id='progress-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                  <stop offset='0%' stopColor='#6366f1' />
                  <stop offset='100%' stopColor='#a855f7' />
                </linearGradient>
              </defs>
            </svg>
            <span className='absolute text-sm font-bold text-white'>{percent}%</span>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className='h-2 w-full overflow-hidden rounded-full bg-surface-300'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500'
          />
        </div>
      </div>

      {/* Task Checklist */}
      <div className='space-y-2'>
        {tasks.map((task, index) => {
          const isDone = completed.includes(index);
          const taskText = getTaskText(task);
          const taskUrl = getTaskUrl(task);
          const taskLabel = getTaskLabel(task);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`card-glass flex items-start gap-4 !p-4 cursor-pointer group transition-all duration-200 ${
                isDone ? '!border-green-500/20 !bg-green-500/5' : 'hover:!border-accent/20'
              }`}
              onClick={() => onToggle(index)}
            >
              <input
                type='checkbox'
                checked={isDone}
                onChange={() => onToggle(index)}
                className='tracker-checkbox mt-0.5'
                onClick={(e) => e.stopPropagation()}
              />
              <div className='flex-1 min-w-0'>
                <p className={`text-sm leading-relaxed transition-all duration-200 ${
                  isDone ? 'text-slate-500 line-through' : 'text-slate-200 group-hover:text-white'
                }`}>
                  {taskText}
                </p>
                {/* Resource Link */}
                {taskUrl && (
                  <a
                    href={taskUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={(e) => e.stopPropagation()}
                    className='mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/15 px-2.5 py-1 text-xs font-medium text-accent-light transition-all hover:bg-accent/20 hover:border-accent/30 hover:shadow-glow'
                  >
                    <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25' />
                    </svg>
                    {taskLabel || 'Learn Resource'}
                  </a>
                )}
              </div>
              <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full transition-all ${
                isDone ? 'bg-green-500/15 text-green-400' : 'bg-surface-200 text-slate-500'
              }`}>
                {isDone ? '✓ Done' : `#${index + 1}`}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ─── Main Roadmap Page ─── */
const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapResult, setRoadmapResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingActive, setLoadingActive] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { aiProfile } = useResume();
  const user = getUserProfile();
  const focusSkillParam = searchParams.get('focusSkill');
  const { register, handleSubmit, setValue } = useForm({ defaultValues: { targetRole: user?.careerGoal || 'Software Engineer' } });

  // Fetch existing active roadmap on mount (only if no focusSkill param)
  useEffect(() => {
    if (focusSkillParam) {
      setLoadingActive(false);
      return;
    }
    const fetchActive = async () => {
      try {
        const response = await api.get('/roadmap/active');
        const data = response.data.data.roadmap;
        if (data) {
          setRoadmap(data);
          setRoadmapResult({
            roadmaps: data.periods || {},
            resources: data.resources || [],
            milestones: data.milestones || []
          });
        }
      } catch (err) {
        console.error('Failed to fetch active roadmap:', err);
      } finally {
        setLoadingActive(false);
      }
    };
    fetchActive();
  }, [focusSkillParam]);

  // Auto-generate when redirected from Skills page with focusSkill
  useEffect(() => {
    if (focusSkillParam && !loading && !roadmapResult) {
      const targetRole = user?.careerGoal || 'Software Engineer';
      setValue('targetRole', targetRole);
      loadRoadmap(targetRole, focusSkillParam);
      // Clear the query param so re-renders don't re-trigger
      setSearchParams({}, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSkillParam]);

  const loadRoadmap = async (targetRole, focusSkill = null) => {
    setLoading(true);
    setRoadmap(null);
    setRoadmapResult(null);
    try {
      const body = { targetRole };
      if (focusSkill) body.focusSkill = focusSkill;
      const response = await api.post('/roadmap/generate', body);
      setRoadmap(response.data.data.roadmap);
      setRoadmapResult(response.data.data.roadmapResult);
    } catch (error) {
      console.error(error);
      alert('Failed to generate roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = useCallback(async (plan) => {
    if (!roadmap?._id) return;
    try {
      const response = await api.put('/roadmap/select-plan', { roadmapId: roadmap._id, plan });
      setRoadmap(response.data.data.roadmap);
    } catch (error) {
      console.error(error);
      alert('Failed to select plan.');
    }
  }, [roadmap]);

  const handleToggleTask = useCallback(async (taskIndex) => {
    if (!roadmap?._id) return;
    try {
      const response = await api.put('/roadmap/toggle-task', { roadmapId: roadmap._id, taskIndex });
      setRoadmap(response.data.data.roadmap);
    } catch (error) {
      console.error(error);
      alert('Failed to update task.');
    }
  }, [roadmap]);

  const onSubmit = async (data) => {
    await loadRoadmap(data.targetRole);
  };

  const selectedPlan = roadmap?.selectedPlan;
  const periods = roadmapResult?.roadmaps || roadmap?.periods || {};
  const selectedTasks = selectedPlan ? (periods[selectedPlan] || []) : [];
  const activeFocusSkill = roadmap?.focusSkill;

  return (
    <div className='space-y-6'>
      {/* Focus Skill Banner */}
      {activeFocusSkill && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='card-accent flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500'>
            <svg className='h-4 w-4 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' />
            </svg>
          </div>
          <div>
            <p className='text-sm font-semibold text-white'>🎯 Skill-Focused Roadmap: <span className='gradient-text'>{activeFocusSkill}</span></p>
            <p className='text-xs text-slate-400'>This roadmap is a deep-dive study plan for mastering this specific skill.</p>
          </div>
        </motion.div>
      )}

      {/* Header + Generate Form */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className='card-glass'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10'>
            <svg className='h-5 w-5 text-accent-light' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z' />
            </svg>
          </div>
          <div>
            <h1 className='section-title'>Learning Roadmap</h1>
            <p className='section-subtitle'>Generate a personalized 30/60/90 day plan with direct learning resources, then track your progress.</p>
          </div>
        </div>

        {aiProfile?.skills?.length > 0 && (
          <div className='mt-4 rounded-xl glass-accent px-4 py-3'>
            <p className='text-sm text-accent-light'>
              🎯 Roadmap personalized using your resume — <strong>{aiProfile.skills.length}</strong> skills analyzed
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='mt-6 grid gap-4 sm:grid-cols-2'>
          <label className='block'>
            <span className='text-xs font-medium uppercase tracking-widest text-slate-500'>Target Role</span>
            <select {...register('targetRole')} className='select-dark mt-2'>
              <option>Software Engineer</option>
              <option>AI Engineer</option>
              <option>Machine Learning Engineer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full-Stack Developer</option>
              <option>DevOps Engineer</option>
              <option>Data Analyst</option>
              <option>Data Scientist</option>
              <option>Cybersecurity Engineer</option>
            </select>
          </label>
          <button type='submit' disabled={loading} className='btn-primary self-end'>
            {loading ? (
              <>
                <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' fill='none'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                </svg>
                Generating…
              </>
            ) : 'Generate Roadmap'}
          </button>
        </form>
      </motion.div>

      {/* Loading Animation */}
      <AnimatePresence mode='wait'>
        {loading && <GeneratingOverlay key='loader' text={activeFocusSkill ? `Building ${activeFocusSkill} mastery plan…` : 'Building your personalized roadmap…'} />}
      </AnimatePresence>

      {/* Initial loading spinner for active roadmap */}
      {loadingActive && !loading && (
        <div className='card-glass flex items-center justify-center py-12'>
          <div className='flex items-center gap-3 text-slate-400'>
            <svg className='h-5 w-5 animate-spin' viewBox='0 0 24 24' fill='none'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
            </svg>
            <span className='text-sm'>Loading your roadmap…</span>
          </div>
        </div>
      )}

      {/* Roadmap Results */}
      {!loading && !loadingActive && roadmapResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
          {/* Resources with Links */}
          {roadmapResult.resources?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className='card-glass'>
              <h3 className='text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3'>📚 Core Resources</h3>
              <div className='grid gap-2 sm:grid-cols-2'>
                {roadmapResult.resources.map((resource, i) => {
                  const name = typeof resource === 'string' ? resource : resource?.name || resource;
                  const url = typeof resource === 'object' ? (resource?.url || '') : '';
                  return (
                    <div key={i} className='flex items-center gap-2 rounded-lg bg-surface-100 border border-surface-300/50 px-3 py-2'>
                      <div className='h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0' />
                      {url ? (
                        <a href={url} target='_blank' rel='noopener noreferrer' className='text-sm text-accent-light hover:text-white transition-colors underline underline-offset-2 decoration-accent/30 hover:decoration-accent'>
                          {name}
                        </a>
                      ) : (
                        <span className='text-sm text-slate-300'>{name}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Plan Selection */}
          <div>
            <h3 className='text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4'>
              {selectedPlan ? '📋 Your Plans' : '👆 Select a plan to start tracking'}
            </h3>
            <div className='grid gap-4 lg:grid-cols-3'>
              {['30', '60', '90'].map((period) => {
                const tasks = periods[period] || [];
                const completedForPlan = selectedPlan === period ? (roadmap?.completedTasks || []).length : 0;
                return (
                  <PlanCard
                    key={period}
                    period={period}
                    tasks={tasks}
                    isSelected={selectedPlan === period}
                    completedCount={completedForPlan}
                    onSelect={() => handleSelectPlan(period)}
                  />
                );
              })}
            </div>
          </div>

          {/* Learning Tracker (visible when plan is selected) */}
          {selectedPlan && selectedTasks.length > 0 && (
            <LearningTracker
              tasks={selectedTasks}
              completedTasks={roadmap?.completedTasks || []}
              onToggle={handleToggleTask}
              plan={selectedPlan}
            />
          )}

          {/* Milestones */}
          {roadmapResult.milestones?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='card-glass'>
              <h3 className='text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3'>🏆 Milestones</h3>
              <div className='space-y-2'>
                {roadmapResult.milestones.map((milestone, i) => (
                  <div key={i} className='flex items-center gap-3 rounded-lg bg-surface-100 border border-surface-300/50 px-4 py-3'>
                    <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-xs font-bold text-amber-400'>
                      {i + 1}
                    </div>
                    <span className='text-sm text-slate-300'>{typeof milestone === 'string' ? milestone : milestone?.name || milestone}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RoadmapPage;
