import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/apiClient.js';
import { useResume } from '../contexts/ResumeContext.jsx';
import { getUserProfile } from '../utils/auth.js';

/* ─── Premium Loading Overlay ─── */
const GeneratingOverlay = () => (
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

    <p className='loading-shimmer-text text-lg font-semibold'>Analyzing your skill gaps…</p>
    <p className='mt-2 text-sm text-slate-500'>AI is comparing your profile against role requirements…</p>

    <div className='mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-surface-300'>
      <div className='loading-progress-bar h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500' />
    </div>
  </motion.div>
);

/* ─── Skill Level Badge ─── */
const SkillBadge = ({ skill }) => (
  <span className='inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs font-medium text-accent-light'>
    {typeof skill === 'string' ? skill : skill?.name || skill}
  </span>
);

/* ─── Missing Skill Card with "Master It" action ─── */
const MissingSkillCard = ({ skill, onMaster }) => {
  const skillName = typeof skill === 'string' ? skill : skill?.name || String(skill);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='card-glass flex items-center justify-between gap-3 !p-4 group hover:!border-amber-500/30'
    >
      <div className='flex items-center gap-3 min-w-0'>
        <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10'>
          <svg className='h-4 w-4 text-amber-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
          </svg>
        </div>
        <span className='text-sm text-slate-200 truncate'>{skillName}</span>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onMaster(skillName)}
        className='flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500/15 to-violet-500/10 border border-accent/20 px-3 py-1.5 text-xs font-semibold text-accent-light transition-all hover:from-indigo-500/25 hover:to-violet-500/20 hover:border-accent/40 hover:shadow-glow'
      >
        <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' />
        </svg>
        Master this skill
      </motion.button>
    </motion.div>
  );
};

const SkillAnalysisPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { aiProfile } = useResume();
  const user = getUserProfile();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({ defaultValues: { targetRole: user?.careerGoal || aiProfile?.targetRole || 'Software Engineer' } });

  const loadSkillGap = async (targetRole) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/skills/gap', { targetRole });
      setResult(response.data.data.gapResult);
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

  const handleMasterSkill = (skillName) => {
    // Navigate to roadmap with focusSkill as a query param
    navigate(`/roadmap?focusSkill=${encodeURIComponent(skillName)}`);
  };

  const currentSkills = aiProfile?.skills || [];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className='card-glass'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10'>
            <svg className='h-5 w-5 text-accent-light' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5m-3 1.5l-3-1.5M9 11.25v-5.5' />
            </svg>
          </div>
          <div>
            <h1 className='section-title'>Skill Gap Analysis</h1>
            <p className='section-subtitle'>Compare your resume skills against your target role and find what to learn next.</p>
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
                <SkillBadge key={i} skill={skill} />
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

      {/* Loading Animation */}
      <AnimatePresence mode='wait'>
        {loading && <GeneratingOverlay key='loader' />}
      </AnimatePresence>

      {/* Results */}
      {!loading && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
          {/* Summary Stats */}
          <div className='grid gap-4 sm:grid-cols-2'>
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
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10'>
                  <svg className='h-5 w-5 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div>
                  <p className='text-2xl font-bold text-white'>{result.priorityRecommendations?.length || 0}</p>
                  <p className='text-xs text-slate-400'>Recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Missing Skills with "Master" action */}
          {result.missingSkills?.length > 0 && (
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-semibold uppercase tracking-widest text-slate-400'>⚠️ Missing Skills</h3>
                <span className='text-xs text-slate-500'>Click "Master this skill" to create a learning plan</span>
              </div>
              <div className='space-y-2'>
                {result.missingSkills.map((skill, index) => (
                  <MissingSkillCard
                    key={index}
                    skill={skill}
                    onMaster={handleMasterSkill}
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
    </div>
  );
};

export default SkillAnalysisPage;
