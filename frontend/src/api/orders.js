import api from './axios';

export const ordersAPI = {
  // Checkout cart (creates order and deducts balance)
  checkout: async () => {
    const response = await api.post('/orders/checkout');
    return response.data;
  },

  // Get user's orders
  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get seller's orders (for sellers)
  getSellerOrders: async () => {
    const response = await api.get('/orders/seller');
    return response.data;
  },

  // Update order item status
  updateOrderItemStatus: async (orderId, itemId, status) => {
    const response = await api.patch(`/orders/${orderId}/items/${itemId}/status`, { status });
    return response.data;
  },

  // Request refund
  refundOrderItem: async (orderId, itemId) => {
    const response = await api.post(`/orders/${orderId}/items/${itemId}/refund`);
    return response.data;
  },
};