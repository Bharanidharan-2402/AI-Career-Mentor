import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/apiClient.js';
import { useResume } from '../contexts/ResumeContext.jsx';
import { getUserProfile } from '../utils/auth.js';

/* ─── Premium Loading Overlay ─── */
const GeneratingOverlay = ({ text = 'Generating project ideas…' }) => (
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
            <path strokeLinecap='round' strokeLinejoin='round' d='M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z' />
          </svg>
        </div>
      </div>
      <div className='loading-orbit-dot bg-indigo-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }} />
      <div className='loading-orbit-dot bg-violet-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4, animationDelay: '-0.8s' }} />
      <div className='loading-orbit-dot bg-purple-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4, animationDelay: '-1.6s' }} />
    </div>

    <p className='loading-shimmer-text text-lg font-semibold'>{text}</p>
    <p className='mt-2 text-sm text-slate-500'>AI is curating portfolio-worthy projects for you…</p>

    <div className='mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-surface-300'>
      <div className='loading-progress-bar h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500' />
    </div>
  </motion.div>
);

const difficultyColors = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-danger',
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const { aiProfile } = useResume();
  const user = getUserProfile();
  const { register, handleSubmit } = useForm({ defaultValues: { targetRole: user?.careerGoal || 'Software Engineer', skillLevel: 'Intermediate' } });

  const loadProjects = async (data) => {
    setLoading(true);
    setProjects([]);
    try {
      const response = await api.post('/projects/recommend', data);
      setProjects(response.data.data.recommendations);
    } catch (error) {
      console.error(error);
      alert('Could not load project recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    await loadProjects(data);
  };

  return (
    <div className='space-y-6'>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className='card-glass'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10'>
            <svg className='h-5 w-5 text-accent-light' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z' />
            </svg>
          </div>
          <div>
            <h1 className='section-title'>Project Recommendations</h1>
            <p className='section-subtitle'>Portfolio-worthy project ideas aligned with your target role and skill level.</p>
          </div>
        </div>

        {aiProfile?.skills?.length > 0 && (
          <div className='mt-4 rounded-xl glass-accent px-4 py-3'>
            <p className='text-sm text-accent-light'>
              🎯 Projects personalized based on your resume skills
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='mt-6 grid gap-4 sm:grid-cols-3'>
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
          <label className='block'>
            <span className='text-xs font-medium uppercase tracking-widest text-slate-500'>Skill Level</span>
            <select {...register('skillLevel')} className='select-dark mt-2'>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
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
            ) : 'Get Projects'}
          </button>
        </form>
      </motion.div>

      <AnimatePresence mode='wait'>
        {loading && <GeneratingOverlay key='loader' text='Generating project ideas…' />}
      </AnimatePresence>

      {!loading && projects.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='grid gap-5 lg:grid-cols-2'>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='card-glass group hover:shadow-glow-lg'
            >
              <div className='flex items-start justify-between mb-3'>
                <h3 className='text-lg font-semibold text-white group-hover:text-accent-light transition-colors'>{project.title}</h3>
                <span className={difficultyColors[project.difficulty] || 'badge-accent'}>{project.difficulty}</span>
              </div>
              <p className='text-sm text-slate-400 leading-relaxed'>{project.description}</p>
              {project.techStack?.length > 0 && (
                <div className='mt-4 flex flex-wrap gap-2'>
                  {project.techStack.map((tech, i) => (
                    <span key={i} className='rounded-full bg-surface-200 border border-surface-400 px-3 py-1 text-xs text-slate-300'>
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsPage;
