import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/apiClient.js';
import { setToken, setUserProfile } from '../utils/auth.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      setToken(response.data.data.token);
      setUserProfile(response.data.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div className='mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl'>
      <h1 className='text-3xl font-semibold text-slate-900'>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-5'>
        <label className='block'>
          <span className='text-slate-700'>Email</span>
          <input type='email' {...register('email')} className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3' required />
        </label>
        <label className='block'>
          <span className='text-slate-700'>Password</span>
          <input type='password' {...register('password')} className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3' required />
        </label>
        <button type='submit' className='w-full rounded-2xl bg-brand px-4 py-3 text-white'>Sign in</button>
      </form>
      <p className='mt-6 text-center text-slate-500'>New here? <Link to='/register' className='text-brand font-semibold'>Create account</Link></p>
    </div>
  );
};

export default LoginPage;
