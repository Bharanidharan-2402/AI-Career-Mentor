import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/apiClient.js';
import { setToken, setUserProfile } from '../utils/auth.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      setToken(response.data.data.token);
      setUserProfile(response.data.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Registration failed. Try again with a valid email.');
    }
  };

  return (
    <div className='mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl'>
      <h1 className='text-3xl font-semibold text-slate-900'>Create your account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-5'>
        <label className='block'>
          <span className='text-slate-700'>Name</span>
          <input type='text' {...register('name')} className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3' required />
        </label>
        <label className='block'>
          <span className='text-slate-700'>Email</span>
          <input type='email' {...register('email')} className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3' required />
        </label>
        <label className='block'>
          <span className='text-slate-700'>Password</span>
          <input type='password' {...register('password')} className='mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3' required />
        </label>
        <button type='submit' className='w-full rounded-2xl bg-brand px-4 py-3 text-white'>Register</button>
      </form>
      <p className='mt-6 text-center text-slate-500'>Already registered? <Link to='/login' className='text-brand font-semibold'>Login</Link></p>
    </div>
  );
};

export default RegisterPage;
