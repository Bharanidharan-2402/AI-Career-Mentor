import { useState, useCallback } from 'react';
import api from '../api/apiClient.js';

export const useCareerMentor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSkillGap = useCallback(async (targetRole) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/skills/gap', { targetRole });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Skill gap analysis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRoadmap = useCallback(async (targetRole) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/roadmap/generate', { targetRole });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Roadmap generation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjects = useCallback(async (targetRole, skillLevel) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/projects/recommend', { targetRole, skillLevel });
      return response.data.data.recommendations;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Project recommendations failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInterviewQuestions = useCallback(async (targetRole, interviewType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/interview/questions', { targetRole, interviewType });
      return response.data.data.interviewPackage;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Interview generation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const scoreResume = useCallback(async (resumeText, targetRole) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/resume/score', { resumeText, targetRole });
      return response.data.data.scoreResult;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Resume scoring failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const chatWithMentor = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/chat', { message });
      return response.data.data.message;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Chat failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getSkillGap, getRoadmap, getProjects, getInterviewQuestions, scoreResume, chatWithMentor, loading, error };
};
