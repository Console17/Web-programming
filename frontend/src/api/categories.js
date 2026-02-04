import api from './axios';

export const categoriesAPI = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Create category (admin only)
  createCategory: async (name) => {
    const response = await api.post('/categories', { name });
    return response.data;
  },

  // Update category (admin only)
  updateCategory: async (id, name) => {
    const response = await api.patch(`/categories/${id}`, { name });
    return response.data;
  },

  // Delete category (admin only)
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};