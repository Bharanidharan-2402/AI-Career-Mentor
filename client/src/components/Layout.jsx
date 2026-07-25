import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { removeToken, removeUserProfile, getToken, getUserProfile } from '../utils/auth.js';
import { Icons } from './UI.jsx';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { path: '/upload-resume', label: 'Resume', icon: Icons.resume },
  { path: '/skills', label: 'Skills', icon: Icons.skills },
  { path: '/roadmap', label: 'Roadmap', icon: Icons.roadmap },
  { path: '/projects', label: 'Projects', icon: Icons.projects },
  { path: '/interview', label: 'Interview', icon: Icons.interview },
  { path: '/chat', label: 'AI Chat', icon: Icons.chat },
  { path: '/profile', label: 'Profile', icon: Icons.profile },
  { path: '/settings', label: 'Settings', icon: Icons.settings }
];

function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserProfile();

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    removeUserProfile();
    navigate('/login');
  };

  if (!getToken()) return null;

  const currentPage = navItems.find((item) => location.pathname.startsWith(item.path));
  const pageTitle = currentPage?.label || 'Dashboard';

  return (
    <div className='flex h-screen overflow-hidden bg-surface'>
      {/* ─── Sidebar ─── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='relative flex flex-col border-r border-surface-300/50 bg-gradient-sidebar'
      >
        {/* Logo */}
        <div className='flex h-16 items-center gap-3 border-b border-surface-300/30 px-4'>
          <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500'>
            <svg className='h-5 w-5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' />
            </svg>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='overflow-hidden'>
                <p className='text-sm font-bold text-white whitespace-nowrap'>Career Mentor</p>
                <p className='text-[10px] text-slate-500 whitespace-nowrap'>AI-Powered Guidance</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className='flex-1 overflow-y-auto px-3 py-4 space-y-1'>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/15 text-accent-light shadow-sm'
                    : 'text-slate-400 hover:bg-surface-200 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`flex-shrink-0 ${isActive ? 'text-accent-light' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {item.icon}
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className='whitespace-nowrap overflow-hidden'>
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !collapsed && (
                    <motion.div layoutId='nav-indicator' className='ml-auto h-1.5 w-1.5 rounded-full bg-accent-light' />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Collapse */}
        <div className='border-t border-surface-300/30 p-3 space-y-2'>
          {!collapsed && (
            <div className='flex items-center gap-3 rounded-xl bg-surface-200/50 px-3 py-2.5'>
              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white'>
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className='min-w-0'>
                <p className='truncate text-xs font-semibold text-white'>{user?.name || 'Student'}</p>
                <p className='truncate text-[10px] text-slate-500'>{user?.email || ''}</p>
              </div>
            </div>
          )}
          <div className='flex gap-2'>
            <button onClick={handleLogout} className='btn-ghost flex-1 !text-red-400 hover:!bg-red-500/10 !text-xs'>
              {Icons.logout}
              {!collapsed && <span>Logout</span>}
            </button>
            <button onClick={() => setCollapsed(!collapsed)} className='btn-ghost !px-2'>
              <svg className={`h-4 w-4 text-slate-500 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ─── Main Content ─── */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Top Bar */}
        <header className='flex h-16 items-center justify-between border-b border-surface-300/30 bg-surface/80 px-6 backdrop-blur-md'>
          <div>
            <h2 className='text-lg font-semibold text-white'>{pageTitle}</h2>
          </div>
          <div className='flex items-center gap-3'>
            <div className='badge-accent'>
              {Icons.sparkle}
              <span className='ml-1'>AI Active</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto p-6'>
          <div className='mx-auto max-w-7xl page-enter'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
