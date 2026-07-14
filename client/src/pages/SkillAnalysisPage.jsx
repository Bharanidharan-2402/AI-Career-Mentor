import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/apiClient.js';
import { getUserProfile } from '../utils/auth.js';

const SkillAnalysisPage = () => {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const user = getUserProfile();
  const { register, handleSubmit } = useForm({ defaultValues: { targetRole: user?.careerGoal || 'Software Engineer' } });

  const loadSkillGap = async (targetRole) => {
    try {
      const response = await api.post('/skills/gap', { targetRole });
      setResult(response.data.data.gapResult);
      setMessage('Skill gaps were generated from your uploaded resume profile.');
    } catch (error) {
      console.error(error);
      setMessage('Skill gap analysis failed.');
    }
  };

  useEffect(() => {
    if (user?.aiProfile?.skills?.length || user?.aiProfile?.summary) {
      loadSkillGap(user.careerGoal || 'Software Engineer');
    }
  }, [user]);

  const onSubmit = async (data) => {
    await loadSkillGap(data.targetRole);
  };

  return (
    <div className='space-y-8'>
      <div className='rounded-3xl bg-white p-8 shadow-xl'>
        <h2 className='text-2xl font-semibold text-slate-900'>Skill Gap Analysis</h2>
        <p className='mt-3 text-slate-600'>Compare your resume profile with a selected career role and discover the highest impact skills to add.</p>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8 grid gap-4 sm:grid-cols-2'>
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
          <button className='self-end rounded-2xl bg-brand px-5 py-3 text-white'>Analyze Skills</button>
        </form>
      </div>
      {message && <p className='text-sm text-slate-600'>{message}</p>}
      {result && (
        <div className='rounded-3xl bg-white p-8 shadow-xl'>
          <h3 className='text-xl font-semibold text-slate-900'>Gap Summary</h3>
          <p className='mt-3 text-slate-600'>Missing skills and prioritized learning recommendations for your target role.</p>
          <div className='mt-6 grid gap-6 lg:grid-cols-2'>
            <div className='rounded-3xl bg-slate-50 p-6'>
              <h4 className='font-semibold text-slate-900'>Missing Skills</h4>
              <ul className='mt-4 space-y-2 text-slate-700'>
                {result.missingSkills?.map((skill, index) => <li key={index}>• {skill}</li>)}
              </ul>
            </div>
            <div className='rounded-3xl bg-slate-50 p-6'>
              <h4 className='font-semibold text-slate-900'>Priority Recommendations</h4>
              <ul className='mt-4 space-y-2 text-slate-700'>
                {result.priorityRecommendations?.map((item, index) => <li key={index}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillAnalysisPage;
