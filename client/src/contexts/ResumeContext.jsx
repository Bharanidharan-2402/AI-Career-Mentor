import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthContext } from './AuthContext.jsx';

export const ResumeContext = createContext();

/**
 * Provides the latest AI-parsed resume profile to all modules.
 * After upload, call `setResumeProfile(analysis)` and all pages will
 * automatically pick up the fresh data without a page reload.
 */
export const ResumeProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const updateUser = authContext?.updateUser;

  // Derive the profile from auth context so it's always in sync
  const aiProfile = user?.aiProfile || {};

  const setResumeProfile = useCallback((analysis) => {
    if (!updateUser) return;
    // Push into auth context which persists to localStorage
    updateUser({
      aiProfile: analysis,
      resumeUploadedAt: new Date().toISOString(),
    });
  }, [updateUser]);

  return (
    <ResumeContext.Provider value={{ aiProfile, setResumeProfile }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
