import { useEffect, useState } from 'react';
import api from '../api/apiClient.js';
import { getUserProfile } from '../utils/auth.js';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DashboardPage = () => {
  const [progress, setProgress] = useState(null);
  const [overview, setOverview] = useState({ score: 0, gaps: 0, projects: 0 });
  const user = getUserProfile();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/progress');
        setProgress(response.data.data.progress);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const skillData = [
    { subject: 'Frontend', A: 70 },
    { subject: 'Backend', A: 65 },
    { subject: 'AI/ML', A: 50 },
    { subject: 'Cloud', A: 55 },
    { subject: 'Data', A: 60 }
  ];

  const roadmapData = [
    { name: 'Week 1', progress: 20 },
    { name: 'Week 2', progress: 35 },
    { name: 'Week 3', progress: 50 },
    { name: 'Week 4', progress: 70 }
  ];

  return (
    <div className='space-y-8'>
      <div className='rounded-3xl bg-white p-6 shadow'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-2xl font-semibold text-slate-900'>Welcome back, {user?.name || 'Learner'}</h2>
            <p className='mt-2 text-slate-600'>Your AI Mentor dashboard gives career progress, skills, and tasks in one place.</p>
          </div>
        </div>
      </div>
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='rounded-3xl bg-gradient-to-br from-brand to-indigo-700 p-6 text-white shadow-xl'>
          <p className='text-sm uppercase tracking-[0.2em]'>Resume Score</p>
          <p className='mt-4 text-4xl font-semibold'>82</p>
          <p className='mt-3 text-slate-200'>ATS-friendly suggestions are waiting on your resume page.</p>
        </div>
        <div className='rounded-3xl bg-white p-6 shadow'>
          <p className='text-sm uppercase tracking-[0.2em] text-slate-500'>Completed Tasks</p>
          <p className='mt-4 text-4xl font-semibold text-slate-900'>{progress?.tasksCompleted || 0}</p>
          <p className='mt-3 text-slate-600'>Tasks completed from your current roadmap and practice sessions.</p>
        </div>
        <div className='rounded-3xl bg-white p-6 shadow'>
          <p className='text-sm uppercase tracking-[0.2em] text-slate-500'>Growth Opportunities</p>
          <p className='mt-4 text-4xl font-semibold text-brand'>{overview.gaps}</p>
          <p className='mt-3 text-slate-600'>Skill gaps identified for your target role.</p>
        </div>
      </div>
      <div className='grid gap-6 lg:grid-cols-2'>
        <div className='rounded-3xl bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-slate-900'>Skill Radar</h3>
            <span className='text-sm text-slate-500'>Live snapshot</span>
          </div>
          <div className='mt-6 h-96'>
            <ResponsiveContainer width='100%' height='100%'>
              <RadarChart data={skillData} outerRadius='80%'>
                <PolarGrid />
                <PolarAngleAxis dataKey='subject' />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name='Skills' dataKey='A' stroke='#4f46e5' fill='#6366f1' fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className='rounded-3xl bg-white p-6 shadow'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-slate-900'>Roadmap Progress</h3>
            <span className='text-sm text-slate-500'>{user?.careerGoal || 'Target role'}</span>
          </div>
          <div className='mt-6 h-96'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={roadmapData}> 
                <XAxis dataKey='name' stroke='#334155' />
                <YAxis stroke='#334155' />
                <Tooltip />
                <Bar dataKey='progress' fill='#4f46e5' radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
