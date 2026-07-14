import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/apiClient.js';
import { getUserProfile } from '../utils/auth.js';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const user = getUserProfile();
  const { register, handleSubmit } = useForm({ defaultValues: { targetRole: user?.careerGoal || 'Software Engineer', skillLevel: 'Intermediate' } });

  const loadProjects = async (data) => {
    try {
      const response = await api.post('/projects/recommend', data);
      setProjects(response.data.data.recommendations);
    } catch (error) {
      console.error(error);
      alert('Could not load project recommendations.');
    }
  };

  useEffect(() => {
    if (user?.aiProfile?.skills?.length || user?.aiProfile?.summary) {
      loadProjects({ targetRole: user.careerGoal || 'Software Engineer', skillLevel: 'Intermediate' });
    }
  }, [user]);

  const onSubmit = async (data) => {
    await loadProjects(data);
  };

  return (
    <div className='space-y-8'>
      <div className='rounded-3xl bg-white p-8 shadow-xl'>
        <h2 className='text-2xl font-semibold text-slate-900'>Project Recommendations</h2>
        <p className='mt-3 text-slate-600'>Receive role-aligned project ideas to strengthen your portfolio and interview readiness.</p>
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
            <span className='text-slate-700'>Skill Level</span>
            <select {...register('skillLevel')} className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3'>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <button className='self-end rounded-2xl bg-brand px-5 py-3 text-white'>Get Projects</button>
        </form>
      </div>
      <div className='grid gap-6 lg:grid-cols-2'>
        {projects.map((project, index) => (
          <div key={index} className='rounded-3xl bg-white p-6 shadow'>
            <h3 className='text-xl font-semibold text-slate-900'>{project.title}</h3>
            <p className='mt-3 text-slate-600'>{project.description}</p>
            <div className='mt-4 flex flex-wrap gap-2 text-sm text-slate-500'>
              <span className='rounded-full bg-slate-100 px-3 py-1'>Difficulty: {project.difficulty}</span>
              <span className='rounded-full bg-slate-100 px-3 py-1'>Tech: {project.techStack.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
