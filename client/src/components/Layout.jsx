import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { removeToken, removeUserProfile } from '../utils/auth.js';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/upload-resume', label: 'Resume' },
  { path: '/skills', label: 'Skills' },
  { path: '/roadmap', label: 'Roadmap' },
  { path: '/projects', label: 'Projects' },
  { path: '/interview', label: 'Interview' },
  { path: '/chat', label: 'AI Chat' },
  { path: '/profile', label: 'Profile' }
];

function Layout() {
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    removeToken();
    removeUserProfile();
    window.location.href = '/login';
  };

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <div className='flex'>
        <aside className={`bg-white border-r border-slate-200 p-4 transition-all duration-300 ${open ? 'w-72' : 'w-20'}`}>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-xl font-semibold text-slate-900'>Career Mentor</h1>
              <p className='text-sm text-slate-500'>AI student advisor</p>
            </div>
            <button className='text-slate-500' onClick={() => setOpen(!open)}>{open ? '◀' : '▶'}</button>
          </div>
          <nav className='space-y-2'>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                {open ? item.label : item.label.charAt(0)}
              </NavLink>
            ))}
          </nav>
          <button onClick={handleLogout} className='mt-10 w-full rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800'>Logout</button>
        </aside>
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
