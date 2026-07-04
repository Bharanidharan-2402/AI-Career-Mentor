import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => (
  <div className='mx-auto max-w-6xl'>
    <section className='grid gap-10 lg:grid-cols-2 lg:items-center'>
      <div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className='text-4xl font-semibold text-slate-900'>AI Student Career Mentor Agent</motion.h1>
        <p className='mt-6 text-slate-600'>Analyze your resume, discover skill gaps, build a learning roadmap, practice interviews, and launch your career with guided AI support.</p>
        <div className='mt-8 flex flex-wrap gap-4'>
          <Link to='/register' className='rounded-xl bg-brand px-6 py-3 text-white shadow-lg'>Start Free</Link>
          <Link to='/login' className='rounded-xl border border-slate-300 px-6 py-3 text-slate-700'>Login</Link>
        </div>
      </div>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='rounded-3xl bg-brand-light p-8 shadow-xl'>
        <div className='space-y-4'>
          <div className='rounded-3xl bg-white p-6 shadow'>
            <h2 className='text-xl font-semibold text-slate-900'>Resume Score</h2>
            <p className='mt-2 text-slate-600'>Get instant ATS guidance and action items to improve every resume line.</p>
          </div>
          <div className='rounded-3xl bg-white p-6 shadow'>
            <h2 className='text-xl font-semibold text-slate-900'>Skill Gap Analysis</h2>
            <p className='mt-2 text-slate-600'>Discover missing skills for your desired role with priority learning paths.</p>
          </div>
        </div>
      </motion.div>
    </section>
  </div>
);

export default LandingPage;
