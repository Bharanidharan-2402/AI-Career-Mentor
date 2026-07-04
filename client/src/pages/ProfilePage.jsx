import { getUserProfile } from '../utils/auth.js';

const ProfilePage = () => {
  const user = getUserProfile();

  return (
    <div className='rounded-3xl bg-white p-8 shadow-xl'>
      <h2 className='text-2xl font-semibold text-slate-900'>Profile</h2>
      <div className='mt-6 grid gap-6 sm:grid-cols-2'>
        <div className='rounded-3xl bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Name</p>
          <p className='mt-3 text-xl font-semibold text-slate-900'>{user?.name || 'Student'}</p>
        </div>
        <div className='rounded-3xl bg-slate-50 p-6'>
          <p className='text-sm text-slate-500'>Email</p>
          <p className='mt-3 text-xl font-semibold text-slate-900'>{user?.email || 'n/a'}</p>
        </div>
      </div>
      <div className='mt-6 rounded-3xl bg-slate-50 p-6'>
        <p className='text-sm text-slate-500'>Target Career Goal</p>
        <p className='mt-3 text-xl font-semibold text-slate-900'>{user?.careerGoal || 'Software Engineer'}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
