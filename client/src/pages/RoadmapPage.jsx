import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/apiClient.js';
import { getUserProfile } from '../utils/auth.js';

const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const user = getUserProfile();
  const { register, handleSubmit } = useForm({ defaultValues: { targetRole: user?.careerGoal || 'Software Engineer' } });

  const loadRoadmap = async (targetRole) => {
    try {
      const response = await api.post('/roadmap/generate', { targetRole });
      setRoadmap(response.data.data.roadmapResult);
    } catch (error) {
      console.error(error);
      alert('Failed to generate roadmap.');
    }
  };

  useEffect(() => {
    if (user?.aiProfile?.skills?.length || user?.aiProfile?.summary) {
      loadRoadmap(user.careerGoal || 'Software Engineer');
    }
  }, [user]);

  const onSubmit = async (data) => {
    await loadRoadmap(data.targetRole);
  };

  return (
    <div className='space-y-8'>
      <div className='rounded-3xl bg-white p-8 shadow-xl'>
        <h2 className='text-2xl font-semibold text-slate-900'>Learning Roadmap</h2>
        <p className='mt-3 text-slate-600'>Generate a 30/60/90 day plan for your target career role.</p>
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
          <button className='self-end rounded-2xl bg-brand px-5 py-3 text-white'>Generate Roadmap</button>
        </form>
      </div>
      {roadmap && (
        <div className='space-y-6'>
          <div className='rounded-3xl bg-slate-50 p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-slate-900'>Core resources</h3>
            <ul className='mt-4 space-y-2 text-slate-700'>
              {roadmap.resources?.map((resource, index) => <li key={index}>• {resource}</li>)}
            </ul>
          </div>
          <div className='grid gap-6 lg:grid-cols-3'>
            {['30', '60', '90'].map((period) => (
              <div key={period} className='rounded-3xl bg-white p-6 shadow'>
                <h3 className='text-xl font-semibold text-slate-900'>{period}-Day Plan</h3>
                <ul className='mt-4 space-y-2 text-slate-700'>
                  {roadmap.roadmaps?.[period]?.map((task, index) => <li key={index}>• {task}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className='rounded-3xl bg-white p-6 shadow'>
            <h3 className='text-lg font-semibold text-slate-900'>Milestones</h3>
            <ul className='mt-4 space-y-2 text-slate-700'>
              {roadmap.milestones?.map((milestone, index) => <li key={index}>• {milestone}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
