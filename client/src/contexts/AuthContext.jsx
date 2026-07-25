import React, { createContext, useState, useCallback, useEffect } from 'react';
import { getToken, setToken as persistToken, removeToken, getUserProfile, setUserProfile, removeUserProfile } from '../utils/auth.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUserProfile());
  const [token, setTokenState] = useState(() => getToken());
  const [loading, setLoading] = useState(false);

  // Keep localStorage in sync whenever user changes
  const login = useCallback((userData, userToken) => {
    persistToken(userToken);
    setUserProfile(userData);
    setUser(userData);
    setTokenState(userToken);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    removeUserProfile();
    setUser(null);
    setTokenState(null);
  }, []);

  // Called after resume upload to refresh the user profile everywhere
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = {
        ...(prev || {}),
        ...updates,
        aiProfile: {
          ...((prev || {}).aiProfile || {}),
          ...(updates.aiProfile || {}),
        },
      };
      setUserProfile(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, setLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
