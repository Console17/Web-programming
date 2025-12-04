import api from './axios';

export const productsAPI = {
  // Get all products with pagination and sorting
  getProducts: async (page = 1, limit = 10, sort = '') => {
    const params = new URLSearchParams({ page, limit });
    if (sort) params.append('sort', sort);
    const response = await api.get(`/products?${params}`);
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get my products (seller/admin only)
  getMyProducts: async () => {
    const response = await api.get('/products/my-products');
    return response.data;
  },

  // Create new product (multipart/form-data)
  createProduct: async (formData) => {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product
  updateProduct: async (id, formData) => {
    const response = await api.patch(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
