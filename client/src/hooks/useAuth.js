import { useState, useCallback } from 'react';
import api from '../api/apiClient.js';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (name, email, password, careerGoal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password, careerGoal });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, login, loading, error };
};
