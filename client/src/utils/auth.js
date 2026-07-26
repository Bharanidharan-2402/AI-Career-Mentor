export const setToken = (token) => window.localStorage.setItem('mentor_token', token);
export const getToken = () => window.localStorage.getItem('mentor_token');
export const removeToken = () => window.localStorage.removeItem('mentor_token');

export const getUserProfile = () => {
  if (typeof window === 'undefined') return null;
  const profile = window.localStorage.getItem('mentor_user');
  if (!profile) return null;
  try {
    return JSON.parse(profile);
  } catch {
    return null;
  }
};

export const setUserProfile = (user) => window.localStorage.setItem('mentor_user', JSON.stringify(user));
export const updateStoredUserProfile = (updates) => {
  const currentProfile = getUserProfile() || {};
  const nextProfile = {
    ...currentProfile,
    ...updates,
    aiProfile: {
      ...(currentProfile.aiProfile || {}),
      ...(updates.aiProfile || {})
    }
  };
  setUserProfile(nextProfile);
  return nextProfile;
};
export const removeUserProfile = () => window.localStorage.removeItem('mentor_user');
