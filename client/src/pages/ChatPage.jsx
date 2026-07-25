import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/apiClient.js';
import { useResume } from '../contexts/ResumeContext.jsx';
import { getUserProfile } from '../utils/auth.js';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { aiProfile } = useResume();
  const user = getUserProfile();

  const onSubmit = async (data) => {
    try {
      // Include resume context so AI can give personalized answers
      const response = await api.post('/chat', {
        message: data.message,
        context: {
          name: user?.name,
          careerGoal: user?.careerGoal,
          skills: aiProfile?.skills,
          summary: aiProfile?.summary,
        }
      });
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: data.message },
        { role: 'ai', text: response.data.data.message, raw: response.data.data.raw }
      ]);
      reset();
    } catch (error) {
      console.error(error);
      alert('Failed to send chat message.');
    }
  };

  const hasResume = !!(aiProfile?.skills?.length || aiProfile?.summary);

  return (
    <div className='space-y-8'>
      <div className='rounded-3xl bg-white p-6 shadow-xl'>
        <h2 className='text-2xl font-semibold text-slate-900'>AI Career Chat</h2>
        <p className='mt-2 text-slate-600'>Ask your AI mentor for career advice, resume tips, project feedback, and interview guidance.</p>
        {hasResume && (
          <div className='mt-4 rounded-2xl bg-indigo-50 border border-indigo-100 px-4 py-3'>
            <p className='text-sm text-indigo-700'>
              🧠 Chat is personalized with your resume — the AI knows your skills and career goals
            </p>
          </div>
        )}
      </div>

      <div className='rounded-3xl bg-white p-6 shadow-xl h-[60vh] overflow-auto flex flex-col gap-4'>
        {messages.length === 0 && (
          <p className='text-slate-500'>
            {hasResume
              ? `Hi ${user?.name || 'there'}! I have your resume. Ask me anything about your career path, skills, or interview prep.`
              : 'No messages yet. Start the conversation below.'}
          </p>
        )}
        {messages.map((msg, index) => (
          <MessageBubble key={index} msg={msg} />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-3'>
        <textarea
          {...register('message')}
          rows='4'
          className='w-full rounded-3xl border border-slate-300 px-4 py-3'
          placeholder={hasResume ? `Ask about your ${user?.careerGoal || 'career'} journey...` : 'Ask your career mentor a question...'}
          required
        />
        <div className='flex gap-3'>
          <button className='flex-1 rounded-2xl bg-brand px-5 py-3 text-white'>Send Message</button>
        </div>
      </form>
    </div>
  );
};

const MessageBubble = ({ msg }) => {
  const isAI = msg.role === 'ai';
  const [open, setOpen] = useState(false);

  return (
    <div className={`max-w-[80%] p-4 rounded-xl ${isAI ? 'bg-slate-50 self-start' : 'bg-brand text-white self-end'}`}>
      <p className='text-xs uppercase tracking-[0.12em] opacity-60'>{isAI ? 'Mentor' : 'You'}</p>
      <div className='mt-2'>
        <p className='whitespace-pre-line'>{msg.text}</p>
        {msg.raw && (
          <div className='mt-2'>
            <button className='text-sm text-slate-500 underline' onClick={() => setOpen(!open)}>
              {open ? 'Hide details' : 'Show details'}
            </button>
            {open && (
              <div className='mt-3'>
                <StructuredSummary data={msg.raw} textFallback={msg.text} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StructuredSummary = ({ data, textFallback }) => {
  if (!data) return <p className='whitespace-pre-line'>{textFallback}</p>;

  return (
    <div className='space-y-3'>
      {data.summary && (
        <div className='rounded-lg border border-slate-200 bg-white p-3'>
          <p className='text-sm font-semibold'>Summary</p>
          <p className='mt-1 text-sm text-slate-700'>{data.summary}</p>
        </div>
      )}
      {data.skills && data.skills.length > 0 && (
        <div className='rounded-lg border border-slate-200 bg-white p-3'>
          <p className='text-sm font-semibold'>Skills</p>
          <div className='mt-2 flex flex-wrap gap-2'>
            {data.skills.map((s, i) => (
              <span key={i} className='rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700'>
                {typeof s === 'string' ? s : s.name}
              </span>
            ))}
          </div>
        </div>
      )}
      {data.projects && data.projects.length > 0 && (
        <div className='rounded-lg border border-slate-200 bg-white p-3'>
          <p className='text-sm font-semibold'>Projects</p>
          <ul className='mt-2 space-y-2'>
            {data.projects.map((p, i) => (
              <li key={i} className='text-sm text-slate-700'>
                <strong>{p.title || p.name}</strong>{p.description ? ` — ${p.description}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!data.summary && !data.skills && !data.projects && (
        <p className='whitespace-pre-line'>{textFallback}</p>
      )}
    </div>
  );
};

export default ChatPage;
