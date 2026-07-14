import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/apiClient.js';
import { setToken, setUserProfile } from '../utils/auth.js';

const handleGoogleSignIn = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = 'openid email profile';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId || '')}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  window.location.href = authUrl;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/register', {
        ...data,
        careerGoal: data.careerGoal || 'Software Engineer'
      });
      const { token, user } = response.data.data;
      setToken(token);
      setUserProfile(user);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error?.message || 'Registration failed. Try again with a valid email.';
      alert(message);
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
      <div className='mt-4'>
        <button type='button' onClick={handleGoogleSignIn} className='w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700'>Continue with Google</button>
      </div>
      <p className='mt-6 text-center text-slate-500'>Already registered? <Link to='/login' className='text-brand font-semibold'>Login</Link></p>
    </div>
  );
};

export default RegisterPage;
