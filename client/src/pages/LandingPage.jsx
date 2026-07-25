import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons } from '../components/UI.jsx';

const features = [
  { icon: Icons.resume, title: 'Resume Analysis', desc: 'AI extracts skills, experience and gives ATS-ready feedback instantly.' },
  { icon: Icons.skills, title: 'Skill Gap Detection', desc: 'Discover missing skills for your dream role with priority learning paths.' },
  { icon: Icons.roadmap, title: '30/60/90 Roadmap', desc: 'Personalized career roadmap with milestones, resources and timelines.' },
  { icon: Icons.interview, title: 'Mock Interviews', desc: 'Practice with AI-generated questions, ideal answers and deep-dive hints.' },
  { icon: Icons.projects, title: 'Project Ideas', desc: 'Get role-aligned portfolio projects with tech stacks and difficulty levels.' },
  { icon: Icons.chat, title: 'AI Career Chat', desc: 'Ask your mentor anything — resume tips, career advice, interview prep.' }
];

const stats = [
  { value: '6+', label: 'AI Agents' },
  { value: '10+', label: 'Career Roles' },
  { value: '24/7', label: 'Available' },
  { value: '100%', label: 'Free' }
];

const LandingPage = () => (
  <div className='min-h-screen bg-surface overflow-hidden'>
    {/* Nav */}
    <nav className='mx-auto flex max-w-7xl items-center justify-between px-6 py-5'>
      <div className='flex items-center gap-3'>
        <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500'>
          <svg className='h-5 w-5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' />
          </svg>
        </div>
        <span className='text-lg font-bold text-white'>Career Mentor</span>
      </div>
      <div className='flex items-center gap-3'>
        <Link to='/login' className='btn-ghost text-slate-300'>Login</Link>
        <Link to='/register' className='btn-primary !py-2 !px-5 !text-xs'>Get Started</Link>
      </div>
    </nav>

    {/* Hero */}
    <section className='relative mx-auto max-w-7xl px-6 pt-20 pb-32'>
      {/* Glow effects */}
      <div className='absolute top-20 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]' />
      <div className='absolute top-40 right-1/4 h-72 w-72 rounded-full bg-violet-500/8 blur-[100px]' />

      <div className='relative grid gap-16 lg:grid-cols-2 lg:items-center'>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className='badge-accent mb-6'>
            {Icons.sparkle}
            <span className='ml-1.5'>Powered by Gemini AI</span>
          </div>
          <h1 className='text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl'>
            Your AI-Powered<br />
            <span className='gradient-text'>Career Mentor</span>
          </h1>
          <p className='mt-6 max-w-lg text-lg text-slate-400 leading-relaxed'>
            Upload your resume and let 6 specialized AI agents analyze your skills, find gaps, build roadmaps, generate interview questions, and guide your career — all in one platform.
          </p>
          <div className='mt-10 flex flex-wrap gap-4'>
            <Link to='/register' className='btn-primary !px-8 !py-4 !text-base'>
              Start Free — No Card Required
              <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3' />
              </svg>
            </Link>
            <Link to='/login' className='btn-secondary !py-4'>
              Sign In
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className='space-y-4'>
          {[
            { title: 'Resume Score', val: '87/100', color: 'from-indigo-500/20 to-violet-500/10' },
            { title: 'Skills Detected', val: '12 skills', color: 'from-emerald-500/15 to-teal-500/10' },
            { title: 'Interview Ready', val: '92%', color: 'from-amber-500/15 to-orange-500/10' }
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
              className={`card-glass !bg-gradient-to-r ${card.color} !p-5`}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs font-medium uppercase tracking-widest text-slate-500'>{card.title}</p>
                  <p className='mt-1 text-2xl font-bold text-white'>{card.val}</p>
                </div>
                <div className='h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-accent-light'>
                  {Icons.sparkle}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className='border-y border-surface-300/30 bg-surface-50/50'>
      <div className='mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4'>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className='text-center'
          >
            <p className='text-3xl font-extrabold gradient-text'>{stat.value}</p>
            <p className='mt-1 text-sm text-slate-500'>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className='mx-auto max-w-7xl px-6 py-24'>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className='text-center mb-16'>
        <h2 className='text-3xl font-extrabold text-white'>Everything you need to <span className='gradient-text'>launch your career</span></h2>
        <p className='mt-4 text-slate-400 max-w-2xl mx-auto'>Six specialized AI agents work together to analyze, plan, and mentor your career journey from resume to offer letter.</p>
      </motion.div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className='card-glass group cursor-default'
          >
            <div className='mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-light transition-colors group-hover:bg-accent/20'>
              {feat.icon}
            </div>
            <h3 className='text-base font-semibold text-white'>{feat.title}</h3>
            <p className='mt-2 text-sm text-slate-400 leading-relaxed'>{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className='mx-auto max-w-4xl px-6 pb-24'>
      <div className='card-accent text-center !py-14'>
        <h2 className='text-3xl font-extrabold text-white'>Ready to accelerate your career?</h2>
        <p className='mt-4 text-slate-400 max-w-lg mx-auto'>Join students and professionals using AI-powered mentorship to land their dream roles faster.</p>
        <div className='mt-8'>
          <Link to='/register' className='btn-primary !px-10 !py-4 !text-base'>
            Get Started Free
          </Link>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className='border-t border-surface-300/30 py-8'>
      <div className='mx-auto max-w-7xl px-6 flex items-center justify-between'>
        <p className='text-sm text-slate-600'>© 2026 AI Career Mentor. Built with Gemini AI.</p>
        <div className='flex items-center gap-2 text-slate-600'>
          {Icons.sparkle}
          <span className='text-xs'>Agentic AI</span>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage;
