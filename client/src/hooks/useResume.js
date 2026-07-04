import { useState, useCallback } from 'react';
import api from '../api/apiClient.js';

export const useResume = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadResume = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeResume = useCallback(async (resumeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/resume/analyze', { resumeId });
      return response.data.data.analysis;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Analysis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadResume, analyzeResume, loading, error };
};
