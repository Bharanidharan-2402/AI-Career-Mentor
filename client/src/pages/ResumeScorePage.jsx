import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/apiClient.js';

const ResumeScorePage = () => {
  const [scoreResult, setScoreResult] = useState(null);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/resume/score', data);
      setScoreResult(response.data.data.scoreResult);
    } catch (error) {
      console.error(error);
      alert('Resume score evaluation failed.');
    }
  };

  return (
    <div className='space-y-8'>
      <div className='rounded-3xl bg-white p-8 shadow-xl'>
        <h2 className='text-2xl font-semibold text-slate-900'>Resume Score</h2>
        <p className='mt-3 text-slate-600'>Paste your resume text and get a score, keyword suggestions, and rewriting recommendations.</p>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-4'>
          <label className='block'>
            <span className='text-slate-700'>Target Role</span>
            <input type='text' {...register('targetRole')} className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3' defaultValue='Software Engineer' required />
          </label>
          <label className='block'>
            <span className='text-slate-700'>Resume Text</span>
            <textarea {...register('resumeText')} rows='10' className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3' required />
          </label>
          <button className='rounded-2xl bg-brand px-5 py-3 text-white'>Get Resume Score</button>
        </form>
      </div>
      {scoreResult && (
        <div className='rounded-3xl bg-white p-8 shadow-xl'>
          <h3 className='text-xl font-semibold text-slate-900'>Score: {scoreResult.score}</h3>
          <div className='mt-6 grid gap-6 lg:grid-cols-2'>
            <div className='rounded-2xl bg-slate-50 p-6'>
              <h4 className='font-semibold text-slate-900'>Improvement Suggestions</h4>
              <ul className='mt-4 space-y-2 text-slate-700'>
                {scoreResult.recommendations?.map((item, idx) => <li key={idx}>• {item}</li>)}
              </ul>
            </div>
            <div className='rounded-2xl bg-slate-50 p-6'>
              <h4 className='font-semibold text-slate-900'>Rewritten Bullet Points</h4>
              <ul className='mt-4 space-y-2 text-slate-700'>
                {scoreResult.rewrittenBullets?.map((bullet, idx) => <li key={idx}>• {bullet}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeScorePage;
