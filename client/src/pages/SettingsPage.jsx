import { useState } from 'react';

const SettingsPage = () => {
  const [theme, setTheme] = useState('light');

  return (
    <div className='rounded-3xl bg-white p-8 shadow-xl'>
      <h2 className='text-2xl font-semibold text-slate-900'>Settings</h2>
      <div className='mt-8 space-y-6'>
        <div className='rounded-3xl bg-slate-50 p-6'>
          <h3 className='text-lg font-semibold text-slate-900'>Appearance</h3>
          <p className='mt-3 text-slate-600'>Choose between light and dark mode for your dashboard.</p>
          <div className='mt-4 flex gap-3'>
            {['light', 'dark'].map((option) => (
              <button key={option} onClick={() => setTheme(option)} className={`rounded-2xl px-4 py-2 ${theme === option ? 'bg-brand text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>{option}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
