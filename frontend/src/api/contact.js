import api from './axios';

export const contactAPI = {
  createMessage: async (messageData) => {
    const response = await api.post('/contact', messageData);
    return response.data;
  },

  getAllMessages: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await api.delete(`/contact/${messageId}`);
    return response.data;
  }
};