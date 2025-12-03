import api from './axios';

export const authAPI = {
  // Sign in
  signIn: async (email, password) => {
    const response = await api.post('/auth/sign-in', { email, password });
    return response.data;
  },

  // Sign up
  signUp: async (userName, email, password, role) => {
    const response = await api.post('/auth/sign-up', { 
      userName, 
      email, 
      password, 
      role 
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/current-user');
    return response.data;
  },
};
