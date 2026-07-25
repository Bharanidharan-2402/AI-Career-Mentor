import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/apiClient.js';
import { useResume } from '../contexts/ResumeContext.jsx';
import { getUserProfile } from '../utils/auth.js';

/* ─── Premium Loading Overlay ─── */
const GeneratingOverlay = ({ text = 'Generating interview questions…' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className='card-glass flex flex-col items-center justify-center py-20'
  >
    {/* Orbit animation */}
    <div className='relative mb-8' style={{ width: 100, height: 100 }}>
      <div className='loading-pulse-ring' style={{ width: 100, height: 100, top: 0, left: 0 }} />
      <div className='loading-pulse-ring' style={{ width: 70, height: 70, top: 15, left: 15, animationDelay: '0.5s' }} />
      {/* Center icon */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow'>
          <svg className='h-6 w-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' />
          </svg>
        </div>
      </div>
      {/* Orbiting dots */}
      <div className='loading-orbit-dot bg-indigo-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4 }} />
      <div className='loading-orbit-dot bg-violet-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4, animationDelay: '-0.8s' }} />
      <div className='loading-orbit-dot bg-purple-400' style={{ top: '50%', left: '50%', marginTop: -4, marginLeft: -4, animationDelay: '-1.6s' }} />
    </div>

    <p className='loading-shimmer-text text-lg font-semibold'>{text}</p>
    <p className='mt-2 text-sm text-slate-500'>AI is analyzing your profile and crafting questions…</p>

    {/* Progress bar */}
    <div className='mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-surface-300'>
      <div className='loading-progress-bar h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500' />
    </div>
  </motion.div>
);

const InterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoadingIndex, setDetailLoadingIndex] = useState(null);
  const [detailByIndex, setDetailByIndex] = useState({});
  const [currentInterviewRequest, setCurrentInterviewRequest] = useState({ targetRole: 'Software Engineer', interviewType: 'Technical' });
  const { aiProfile } = useResume();
  const user = getUserProfile();
  const { register, handleSubmit } = useForm({ defaultValues: { targetRole: user?.careerGoal || 'Software Engineer', interviewType: 'Technical', questionCount: 5 } });

  const loadQuestions = async (data) => {
    setLoading(true);
    setQuestions([]);
    try {
      const requestData = { ...data, questionCount: Number(data.questionCount) || 5 };
      const response = await api.post('/interview/questions', requestData);
      setQuestions(response.data.data.interviewPackage.questions || []);
      setCurrentInterviewRequest({ targetRole: requestData.targetRole, interviewType: requestData.interviewType });
      setDetailByIndex({});
    } catch (error) {
      console.error(error);
      alert('Interview generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestionDetail = async (question, index) => {
    setDetailLoadingIndex(index);
    try {
      const response = await api.post('/interview/detail', {
        targetRole: currentInterviewRequest.targetRole,
        interviewType: currentInterviewRequest.interviewType,
        question: String(question || '')
      });
      setDetailByIndex((prev) => ({ ...prev, [index]: response.data.data.detail }));
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error?.message || error.message || 'Failed to load question detail.';
      alert(message);
    } finally {
      setDetailLoadingIndex(null);
    }
  };

  const onSubmit = async (data) => {
    await loadQuestions(data);
  };

  return (
    <div className='space-y-6'>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className='card-glass'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10'>
            <svg className='h-5 w-5 text-accent-light' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' />
            </svg>
          </div>
          <div>
            <h1 className='section-title'>Mock Interview Practice</h1>
            <p className='section-subtitle'>Generate questions and ideal answers for technical, HR, and design interviews.</p>
          </div>
        </div>

        {aiProfile?.skills?.length > 0 && (
          <div className='mt-4 rounded-xl glass-accent px-4 py-3'>
            <p className='text-sm text-accent-light'>
              🎯 Questions personalized based on your resume — targeting <strong>{user?.careerGoal || 'Software Engineer'}</strong>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='mt-6 grid gap-4 sm:grid-cols-4'>
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
            <span className='text-xs font-medium uppercase tracking-widest text-slate-500'>Interview Type</span>
            <select {...register('interviewType')} className='select-dark mt-2'>
              <option>Technical</option>
              <option>HR</option>
              <option>Coding</option>
              <option>System Design</option>
            </select>
          </label>
          <label className='block'>
            <span className='text-xs font-medium uppercase tracking-widest text-slate-500'>Questions</span>
            <select {...register('questionCount')} className='select-dark mt-2'>
              <option value='5'>5</option>
              <option value='7'>7</option>
              <option value='10'>10</option>
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
            ) : 'Generate Interview'}
          </button>
        </form>
      </motion.div>

      <AnimatePresence mode='wait'>
        {loading && <GeneratingOverlay key='loader' text='Generating interview questions…' />}
      </AnimatePresence>

      {!loading && questions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='space-y-4'>
          {questions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className='card-glass'
            >
              <div className='flex items-start gap-4'>
                <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/15 text-xs font-bold text-accent-light'>
                  {index + 1}
                </div>
                <div className='flex-1'>
                  <p className='text-[10px] font-semibold uppercase tracking-widest text-slate-500'>{item.category}</p>
                  <h3 className='mt-1 text-lg font-semibold text-white'>{item.question}</h3>
                  <div className='mt-4 rounded-xl bg-surface-100 border border-surface-300/50 p-4'>
                    <p className='text-sm text-slate-300'><span className='font-semibold text-green-400'>Answer:</span> {item.idealAnswer}</p>
                  </div>
                  <p className='mt-3 text-sm text-slate-500'><span className='font-medium text-amber-400'>💡 Hint:</span> {item.hint}</p>
                  <button
                    type='button'
                    disabled={detailLoadingIndex === index}
                    className='btn-secondary mt-4 !py-2 !px-4 !text-xs'
                    onClick={() => loadQuestionDetail(item.question, index)}
                  >
                    {detailLoadingIndex === index ? 'Loading…' : detailByIndex[index] ? 'Refresh detail' : '🔍 Dive deeper'}
                  </button>
                  {detailByIndex[index] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className='mt-4 rounded-xl glass-accent p-4'>
                      <p className='text-xs font-semibold uppercase tracking-widest text-accent-light mb-2'>Deep Dive</p>
                      <p className='text-sm text-slate-300 whitespace-pre-line'>{detailByIndex[index]}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default InterviewPage;
