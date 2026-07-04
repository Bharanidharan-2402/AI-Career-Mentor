import { motion } from 'framer-motion';

export const Card = ({ children, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl bg-white p-6 shadow ${className}`}>
    {children}
  </motion.div>
);

export const Badge = ({ children, color = 'slate' }) => (
  <span className={`rounded-full px-3 py-1 text-sm font-medium bg-${color}-100 text-${color}-700`}>
    {children}
  </span>
);

export const Button = ({ children, loading = false, ...props }) => (
  <button {...props} disabled={loading} className={`rounded-2xl bg-brand px-5 py-3 text-white transition disabled:opacity-50 ${props.className || ''}`}>
    {loading ? '...' : children}
  </button>
);

export const LoadingSpinner = () => (
  <div className='flex items-center justify-center'>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className='h-12 w-12 rounded-full border-4 border-slate-200 border-t-brand'
    />
  </div>
);

export const Alert = ({ type = 'info', message }) => (
  <div className={`rounded-2xl p-4 ${type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
    {message}
  </div>
);
