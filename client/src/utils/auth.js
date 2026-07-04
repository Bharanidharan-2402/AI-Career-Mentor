export const setToken = (token) => window.localStorage.setItem('mentor_token', token);
export const getToken = () => window.localStorage.getItem('mentor_token');
export const removeToken = () => window.localStorage.removeItem('mentor_token');

export const getUserProfile = () => {
  const profile = window.localStorage.getItem('mentor_user');
  return profile ? JSON.parse(profile) : null;
};

export const setUserProfile = (user) => window.localStorage.setItem('mentor_user', JSON.stringify(user));
export const removeUserProfile = () => window.localStorage.removeItem('mentor_user');
