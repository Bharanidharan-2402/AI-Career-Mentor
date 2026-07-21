import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/apiClient.js';
import { getUserProfile } from '../utils/auth.js';

const InterviewPage = () => {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(() => getUserProfile());
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const didAutoLoad = useRef(false);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { targetRole: user?.careerGoal || 'Software Engineer', interviewType: 'Technical' } });

  useEffect(() => {
    const storedUser = getUserProfile();
    if (storedUser) {
      setUser(storedUser);
      reset({ targetRole: storedUser?.careerGoal || 'Software Engineer', interviewType: 'Technical' });
    }
  }, [reset]);

  const loadQuestions = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/interview/questions', data);
      setQuestions(response.data.data.interviewPackage.questions || []);
    } catch (error) {
      console.error(error);
      alert('Interview generation failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didAutoLoad.current) return;
    if (user?.aiProfile?.skills?.length || user?.aiProfile?.summary) {
      didAutoLoad.current = true;
      loadQuestions({ targetRole: user.careerGoal || 'Software Engineer', interviewType: 'Technical' });
    }
  }, [user?.aiProfile?.skills?.length, user?.aiProfile?.summary, user?.careerGoal]);

  const onSubmit = async (data) => {
    await loadQuestions(data);
  };

  return (
    <div className='space-y-8'>
      <div className='rounded-3xl bg-white p-8 shadow-xl'>
        <h2 className='text-2xl font-semibold text-slate-900'>Mock Interview Practice</h2>
        <p className='mt-3 text-slate-600'>Generate questions and ideal answers for technical, HR, and design interviews.</p>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8 grid gap-4 sm:grid-cols-3'>
          <label className='block'>
            <span className='text-slate-700'>Target Role</span>
            <select {...register('targetRole')} className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3'>
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
            <span className='text-slate-700'>Interview Type</span>
            <select {...register('interviewType')} className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3'>
              <option>Technical</option>
              <option>HR</option>
              <option>Coding</option>
              <option>System Design</option>
            </select>
          </label>
          <button className='self-end rounded-2xl bg-brand px-5 py-3 text-white'>Generate Interview</button>
        </form>
      </div>
      {(questions.length > 0 || loading) && (
        <div className='space-y-5'>
          {loading && questions.length === 0 && (
            <div className='rounded-3xl bg-white p-6 shadow'>
              <p className='text-slate-500'>Generating interview questions…</p>
            </div>
          )}
          {questions.map((item, index) => (
            <div key={index} className='rounded-3xl bg-white p-6 shadow'>
              <p className='text-sm uppercase tracking-[0.16em] text-slate-500'>{item.category}</p>
              <h3 className='mt-2 text-xl font-semibold text-slate-900'>{item.question}</h3>
              <p className='mt-4 text-slate-600'><strong>Answer:</strong> {item.idealAnswer}</p>
              <p className='mt-3 text-slate-500'><strong>Hint:</strong> {item.hint}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
