import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/apiClient.js';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/chat', { message: data.message });
      setMessages((prev) => [...prev, { role: 'user', text: data.message }, { role: 'ai', text: response.data.data.message }]);
      reset();
    } catch (error) {
      console.error(error);
      alert('Failed to send chat message.');
    }
  };

  return (
    <div className='space-y-8'>
      <div className='rounded-3xl bg-white p-8 shadow-xl'>
        <h2 className='text-2xl font-semibold text-slate-900'>AI Career Chat</h2>
        <p className='mt-3 text-slate-600'>Ask your AI mentor for career advice, resume tips, project feedback, and interview guidance.</p>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8 grid gap-4'>
          <textarea {...register('message')} rows='5' className='w-full rounded-3xl border border-slate-300 px-4 py-4' placeholder='Ask your career mentor a question...' required />
          <button className='w-full rounded-2xl bg-brand px-5 py-3 text-white'>Send Message</button>
        </form>
      </div>
      <div className='space-y-4'>
        {messages.map((msg, index) => (
          <div key={index} className={`rounded-3xl p-6 shadow ${msg.role === 'ai' ? 'bg-slate-50' : 'bg-brand text-white'}`}>
            <p className='text-sm uppercase tracking-[0.16em]'>{msg.role}</p>
            <p className='mt-3 whitespace-pre-line'>{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
