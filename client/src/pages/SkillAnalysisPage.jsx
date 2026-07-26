import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/apiClient.js';
import { useResume } from '../contexts/ResumeContext.jsx';
import { getUserProfile } from '../utils/auth.js';

/* ═══════════════════════════════════════════════════════════
   PREMIUM LOADING OVERLAY
   ═══════════════════════════════════════════════════════════ */
const GeneratingOverlay = ({ text = 'Analyzing your skill gaps…' }) => (
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
            <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5m-3 1.5l-3-1.5M9 11.25v-5.5' />
          </svg>
        </div>
      </div>
      <div className='loading-orbit-dot bg-indigo-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }} />
      <div className='loading-orbit-dot bg-violet-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4, animationDelay: '-0.8s' }} />
      <div className='loading-orbit-dot bg-purple-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4, animationDelay: '-1.6s' }} />
    </div>

    <p className='loading-shimmer-text text-lg font-semibold'>{text}</p>
    <p className='mt-2 text-sm text-slate-500'>AI is comparing your profile against current market demand…</p>

    <div className='mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-surface-300'>
      <div className='loading-progress-bar h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500' />
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   DEMAND LEVEL BADGE
   ═══════════════════════════════════════════════════════════ */
const DemandBadge = ({ level }) => {
  const cls = level === 'High' ? 'demand-high' : level === 'Low' ? 'demand-low' : 'demand-medium';
  const dot = level === 'High' ? '🔴' : level === 'Low' ? '🟢' : '🟡';
  return <span className={cls}>{dot} {level} Demand</span>;
};

/* ═══════════════════════════════════════════════════════════
   MATCHED SKILL BADGE (green)
   ═══════════════════════════════════════════════════════════ */
const MatchedSkillBadge = ({ skill }) => {
  const relevanceColors = {
    High: 'bg-green-500/15 text-green-400 border-green-500/20',
    Medium: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
    Low: 'bg-slate-500/15 text-slate-400 border-slate-500/20'
  };
  const color = relevanceColors[skill.relevance] || relevanceColors.Medium;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${color}`}>
      <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
      </svg>
      {skill.name}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════
   MISSING SKILL CARD — with inline "Master this skill"
   ═══════════════════════════════════════════════════════════ */
const MissingSkillCard = ({ skill, onMaster, isMastering, hasActivePlan }) => {
  const name = typeof skill === 'string' ? skill : skill?.name || String(skill);
  const category = skill?.category || '';
  const demandLevel = skill?.demandLevel || 'Medium';
  const reason = skill?.reason || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='card-glass !p-4 group hover:!border-amber-500/20 transition-all'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-3 min-w-0 flex-1'>
          <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 mt-0.5'>
            <svg className='h-4 w-4 text-amber-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
            </svg>
          </div>
          <div className='min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='text-sm font-semibold text-white'>{name}</span>
              <DemandBadge level={demandLevel} />
              {category && <span className='category-badge'>{category}</span>}
            </div>
            {reason && (
              <p className='text-xs text-slate-400 mt-1.5 leading-relaxed'>{reason}</p>
            )}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMaster(name)}
          disabled={isMastering || hasActivePlan}
          className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            hasActivePlan
              ? 'bg-green-500/10 border border-green-500/20 text-green-400 cursor-default'
              : isMastering
              ? 'bg-surface-200 border border-surface-300 text-slate-500 cursor-wait'
              : 'bg-gradient-to-r from-indigo-500/15 to-violet-500/10 border border-accent/20 text-accent-light hover:from-indigo-500/25 hover:to-violet-500/20 hover:border-accent/40 hover:shadow-glow'
          }`}
        >
          {hasActivePlan ? (
            <>
              <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
              </svg>
              Plan Active
            </>
          ) : isMastering ? (
            <>
              <svg className='h-3.5 w-3.5 animate-spin' viewBox='0 0 24 24' fill='none'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' />
              </svg>
              Master this skill
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CIRCULAR PROGRESS RING (reusable)
   ═══════════════════════════════════════════════════════════ */
const ProgressRing = ({ percent, size = 48 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className='relative flex items-center justify-center' style={{ width: size, height: size }}>
      <svg className='-rotate-90' width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill='none' stroke='rgba(99,102,241,0.1)' strokeWidth='3' />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill='none'
          stroke='url(#lp-gradient)'
          strokeWidth='3'
          strokeLinecap='round'
          strokeDasharray={`${(percent / 100) * circ} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <defs>
          <linearGradient id='lp-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#6366f1' />
            <stop offset='100%' stopColor='#a855f7' />
          </linearGradient>
        </defs>
      </svg>
      <span className='absolute text-xs font-bold text-white'>{percent}%</span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MODULE ACCORDION — expandable weekly module
   ═══════════════════════════════════════════════════════════ */
const ModuleAccordion = ({ mod, moduleIndex, completedTasks, onToggle }) => {
  const [open, setOpen] = useState(moduleIndex === 0); // first module open by default

  const tasks = mod.tasks || [];
  const doneCount = tasks.filter((_, ti) => completedTasks.includes(`${moduleIndex}-${ti}`)).length;
  const allDone = doneCount === tasks.length && tasks.length > 0;

  return (
    <div className='space-y-1'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className={`module-header ${open ? 'active' : ''}`}
      >
        <div className='flex items-center gap-3'>
          <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
            allDone
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gradient-to-br from-indigo-500/20 to-violet-500/10 text-accent-light'
          }`}>
            {allDone ? '✓' : `W${mod.week}`}
          </div>
          <div className='text-left'>
            <p className='text-sm font-semibold text-white'>{mod.title}</p>
            <p className='text-xs text-slate-500'>{doneCount}/{tasks.length} tasks · {mod.description}</p>
          </div>
        </div>
        <svg className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'
          >
            <div className='space-y-1.5 pl-2 pt-1'>
              {tasks.map((task, taskIndex) => {
                const taskKey = `${moduleIndex}-${taskIndex}`;
                const isDone = completedTasks.includes(taskKey);
                return (
                  <div
                    key={taskIndex}
                    className={`flex items-start gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 ${
                      isDone ? 'bg-green-500/5 border border-green-500/10' : 'bg-surface-100/50 border border-transparent hover:border-surface-300/50'
                    }`}
                    onClick={() => onToggle(taskKey)}
                  >
                    <input
                      type='checkbox'
                      checked={isDone}
                      onChange={() => onToggle(taskKey)}
                      className='tracker-checkbox mt-0.5 flex-shrink-0'
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className='flex-1 min-w-0'>
                      <p className={`text-sm leading-relaxed transition-all ${
                        isDone ? 'text-slate-500 line-through' : 'text-slate-200'
                      }`}>
                        {task.title}
                      </p>
                      <div className='flex items-center gap-3 mt-1.5'>
                        {task.resourceUrl && (
                          <a
                            href={task.resourceUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={(e) => e.stopPropagation()}
                            className='inline-flex items-center gap-1 rounded-md bg-accent/10 border border-accent/15 px-2 py-0.5 text-xs font-medium text-accent-light transition-all hover:bg-accent/20 hover:border-accent/30'
                          >
                            <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                              <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25' />
                            </svg>
                            {task.resourceLabel || 'Resource'}
                          </a>
                        )}
                        {task.estimatedHours > 0 && (
                          <span className='text-xs text-slate-600'>~{task.estimatedHours}h</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   LEARNING PLAN CARD — full card for an active plan
   ═══════════════════════════════════════════════════════════ */
const LearningPlanCard = ({ plan, onToggle, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);
  const modules = plan.modules || [];
  const totalTasks = modules.reduce((sum, mod) => sum + (mod.tasks?.length || 0), 0);
  const completedCount = (plan.completedTasks || []).length;
  const percent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const statusColors = {
    active: 'bg-green-500/15 text-green-400 border-green-500/20',
    paused: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    completed: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className='learning-plan-card'
    >
      {/* Plan Header */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3 min-w-0'>
          <ProgressRing percent={percent} size={48} />
          <div className='min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <h4 className='text-base font-bold text-white truncate'>{plan.skillName}</h4>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColors[plan.status]}`}>
                {plan.status}
              </span>
            </div>
            <p className='text-xs text-slate-500 mt-0.5'>
              {plan.totalWeeks} weeks · {completedCount}/{totalTasks} tasks · {plan.targetRole}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          {/* Pause / Resume */}
          {plan.status !== 'completed' && (
            <button
              onClick={() => onStatusChange(plan._id, plan.status === 'paused' ? 'active' : 'paused')}
              className='btn-ghost !px-2 !py-1.5 !text-xs'
              title={plan.status === 'paused' ? 'Resume' : 'Pause'}
            >
              {plan.status === 'paused' ? (
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z' />
                </svg>
              ) : (
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 5.25v13.5m-7.5-13.5v13.5' />
                </svg>
              )}
            </button>
          )}
          {/* Expand / Collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className='btn-ghost !px-2 !py-1.5 !text-xs'
          >
            <svg className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
            </svg>
          </button>
        </div>
      </div>

      {/* Linear progress */}
      <div className='mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-300'>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500'
        />
      </div>

      {/* Expanded: Modules */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='overflow-hidden'
          >
            <div className='space-y-2 mt-4'>
              {modules.map((mod, mi) => (
                <ModuleAccordion
                  key={mi}
                  mod={mod}
                  moduleIndex={mi}
                  completedTasks={plan.completedTasks || []}
                  onToggle={(taskKey) => onToggle(plan._id, taskKey)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
const SkillAnalysisPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [masteringSkill, setMasteringSkill] = useState(null); // skill name currently being generated
  const [learningPlans, setLearningPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [lastTargetRole, setLastTargetRole] = useState('');
  const { aiProfile = {} } = useResume();
  const user = getUserProfile() || null;
  const { register, handleSubmit } = useForm({
    defaultValues: { targetRole: user?.careerGoal || aiProfile?.targetRole || 'Software Engineer' }
  });

  // Load existing learning plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/skills/learning-plans');
        setLearningPlans(response.data.data.learningPlans || []);
      } catch (err) {
        console.error('Failed to fetch learning plans:', err);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  /* ─── Skill Gap Analysis ─── */
  const loadSkillGap = async (targetRole) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/skills/gap', { targetRole });
      setResult(response.data.data.gapResult);
      setLastTargetRole(targetRole);
    } catch (error) {
      console.error(error);
      alert('Skill gap analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    await loadSkillGap(data.targetRole);
  };

  /* ─── Master a Skill — generate learning plan inline ─── */
  const handleMasterSkill = useCallback(async (skillName) => {
    if (masteringSkill) return; // prevent double-click
    setMasteringSkill(skillName);
    try {
      const response = await api.post('/skills/learning-plan', {
        skillName,
        targetRole: lastTargetRole || user?.careerGoal || 'Software Engineer'
      });
      const newPlan = response.data.data.learningPlan;
      // Add or update in local state
      setLearningPlans((prev) => {
        const exists = prev.find((p) => p._id === newPlan._id);
        if (exists) return prev;
        return [newPlan, ...prev];
      });
    } catch (error) {
      console.error(error);
      alert('Failed to generate learning plan.');
    } finally {
      setMasteringSkill(null);
    }
  }, [masteringSkill, lastTargetRole, user?.careerGoal]);

  /* ─── Toggle task in a learning plan ─── */
  const handleToggleTask = useCallback(async (planId, taskKey) => {
    try {
      const response = await api.put('/skills/learning-plan/toggle', { planId, taskKey });
      const updated = response.data.data.learningPlan;
      setLearningPlans((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (error) {
      console.error(error);
    }
  }, []);

  /* ─── Update plan status (pause/resume) ─── */
  const handleStatusChange = useCallback(async (planId, status) => {
    try {
      const response = await api.put('/skills/learning-plan/status', { planId, status });
      const updated = response.data.data.learningPlan;
      setLearningPlans((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const currentSkills = aiProfile?.skills || [];
  const activePlanNames = new Set(learningPlans.map((p) => p.skillName));

  return (
    <div className='space-y-6'>
      {/* ─── HEADER ─── */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className='card-glass'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10'>
            <svg className='h-5 w-5 text-accent-light' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5m-3 1.5l-3-1.5M9 11.25v-5.5' />
            </svg>
          </div>
          <div>
            <h1 className='section-title'>Skill Gap Analysis</h1>
            <p className='section-subtitle'>AI analyzes current market demand and identifies skills you need for your target role.</p>
          </div>
        </div>

        {currentSkills.length > 0 && (
          <div className='mt-4 rounded-xl glass-accent px-4 py-3'>
            <p className='text-sm text-accent-light'>
              🎯 Personalized with your resume — <strong>{currentSkills.length}</strong> skills detected
            </p>
          </div>
        )}

        {/* Current Skills Display */}
        {currentSkills.length > 0 && (
          <div className='mt-4'>
            <p className='text-xs font-medium uppercase tracking-widest text-slate-500 mb-2'>Your Current Skills</p>
            <div className='flex flex-wrap gap-2'>
              {currentSkills.map((skill, i) => (
                <span key={i} className='inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent-light'>
                  {typeof skill === 'string' ? skill : skill?.name || skill}
                </span>
              ))}
            </div>
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
                Analyzing…
              </>
            ) : 'Analyze Skills'}
          </button>
        </form>
      </motion.div>

      {/* ─── LOADING ─── */}
      <AnimatePresence mode='wait'>
        {loading && <GeneratingOverlay key='loader' />}
      </AnimatePresence>

      {/* ─── ANALYSIS RESULTS ─── */}
      {!loading && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>

          {/* Summary Stats */}
          <div className='grid gap-4 sm:grid-cols-3'>
            <div className='card-glass'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10'>
                  <svg className='h-5 w-5 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div>
                  <p className='text-2xl font-bold text-white'>{result.matchedSkills?.length || 0}</p>
                  <p className='text-xs text-slate-400'>Skills Matched</p>
                </div>
              </div>
            </div>
            <div className='card-glass'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10'>
                  <svg className='h-5 w-5 text-amber-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
                  </svg>
                </div>
                <div>
                  <p className='text-2xl font-bold text-white'>{result.missingSkills?.length || 0}</p>
                  <p className='text-xs text-slate-400'>Missing Skills</p>
                </div>
              </div>
            </div>
            <div className='card-glass'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10'>
                  <svg className='h-5 w-5 text-indigo-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' />
                  </svg>
                </div>
                <div>
                  <p className='text-2xl font-bold text-white'>
                    {result.missingSkills?.filter(s => (s.demandLevel || s.demand_level) === 'High').length || 0}
                  </p>
                  <p className='text-xs text-slate-400'>High Demand</p>
                </div>
              </div>
            </div>
          </div>

          {/* Matched Skills */}
          {result.matchedSkills?.length > 0 && (
            <div>
              <h3 className='text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3'>✅ Your Matching Skills</h3>
              <div className='flex flex-wrap gap-2'>
                {result.matchedSkills.map((skill, i) => (
                  <MatchedSkillBadge key={i} skill={typeof skill === 'string' ? { name: skill, relevance: 'Medium' } : skill} />
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills with "Master" action */}
          {result.missingSkills?.length > 0 && (
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-semibold uppercase tracking-widest text-slate-400'>⚠️ Missing Skills — Market Demand</h3>
                <span className='text-xs text-slate-500'>Click "Master this skill" to create a learning plan</span>
              </div>
              <div className='space-y-2'>
                {result.missingSkills.map((skill, index) => (
                  <MissingSkillCard
                    key={index}
                    skill={skill}
                    onMaster={handleMasterSkill}
                    isMastering={masteringSkill === (typeof skill === 'string' ? skill : skill?.name)}
                    hasActivePlan={activePlanNames.has(typeof skill === 'string' ? skill : skill?.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Priority Recommendations */}
          {result.priorityRecommendations?.length > 0 && (
            <div>
              <h3 className='text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3'>🎯 Priority Recommendations</h3>
              <div className='space-y-2'>
                {result.priorityRecommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className='card-glass flex items-start gap-3 !p-4'
                  >
                    <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/10 text-xs font-bold text-accent-light'>
                      {i + 1}
                    </div>
                    <p className='text-sm text-slate-300 leading-relaxed'>{typeof rec === 'string' ? rec : rec?.recommendation || rec?.description || JSON.stringify(rec)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════
         ACTIVE LEARNING PLANS
         ═══════════════════════════════════════════════════════ */}
      {!plansLoading && learningPlans.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10'>
              <svg className='h-5 w-5 text-violet-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' />
              </svg>
            </div>
            <div>
              <h2 className='section-title !text-xl'>Your Learning Plans</h2>
              <p className='section-subtitle'>{learningPlans.length} plan{learningPlans.length !== 1 ? 's' : ''} — track your progress independently</p>
            </div>
          </div>

          <div className='space-y-3'>
            {learningPlans.map((plan) => (
              <LearningPlanCard
                key={plan._id}
                plan={plan}
                onToggle={handleToggleTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Plans loading skeleton */}
      {plansLoading && (
        <div className='card-glass flex items-center justify-center py-8'>
          <div className='flex items-center gap-3 text-slate-400'>
            <svg className='h-5 w-5 animate-spin' viewBox='0 0 24 24' fill='none'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
            </svg>
            <span className='text-sm'>Loading your learning plans…</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillAnalysisPage;
