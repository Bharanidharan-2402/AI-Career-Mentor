import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/apiClient.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

const GoogleCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [message, setMessage] = useState('Finishing sign-in...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setMessage('Google sign-in was cancelled or failed.');
      window.setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!code) {
      setMessage('No authorization code was returned by Google.');
      window.setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const finishGoogleAuth = async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const response = await api.post('/auth/google', { code, redirectUri });
        const { token, user } = response.data.data;
        login(user, token);
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        const msg = err?.response?.data?.error?.message || 'Google sign-in could not be completed.';
        setMessage(`${msg} Redirecting to login…`);
        window.setTimeout(() => navigate('/login'), 2000);
      }
    };

    finishGoogleAuth();
  }, [location.search, navigate, login]);

  return (
    <div className='mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl text-center'>
      <h1 className='text-2xl font-semibold text-slate-900'>Signing you in</h1>
      <p className='mt-4 text-slate-600'>{message}</p>
    </div>
  );
};

export default GoogleCallbackPage;
