import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartAPI } from '../api/cart';
import { ordersAPI } from '../api/orders';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [cartData, setCartData] = useState({ items: [], totalPrice: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
    loadOrders();
  }, [user, navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cart = await cartAPI.getCart();
      setCartData(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      let orderData;
      if (user.role === 'seller' || user.role === 'admin') {
        orderData = await ordersAPI.getSellerOrders();
      } else {
        orderData = await ordersAPI.getMyOrders();
      }
      setOrders(orderData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      await cartAPI.updateCartItem(productId, newQuantity);
      await loadCart(); // Refresh cart
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartAPI.removeCartItem(productId);
      await loadCart(); // Refresh cart
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartData({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    if (cartData.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (user.balance < cartData.totalPrice) {
      alert(`Insufficient balance. You need $${(cartData.totalPrice - user.balance).toFixed(2)} more.`);
      return;
    }

    try {
      setCheckingOut(true);
      await ordersAPI.checkout();
      await refreshUser(); // Update user balance
      await loadCart(); // Clear cart
      await loadOrders(); // Refresh orders
      alert(`Checkout successful! Total: $${cartData.totalPrice.toFixed(2)}`);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(error.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const updateOrderStatus = async (orderId, itemId, newStatus) => {
    try {
      await ordersAPI.updateOrderItemStatus(orderId, itemId, newStatus);
      await loadOrders(); // Refresh orders
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      const message = error.response?.data?.message || 'Failed to update status';
      alert(`Error: ${message}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-left">
          <button onClick={() => navigate('/')} className="btn-secondary">
            Home
          </button>
          <button onClick={() => navigate('/shop')} className="btn-secondary">
            Shop
          </button>
        </div>
        <div className="nav-links">
          {user && (
            <div className="balance-container">
              <div className="balance-display">
                Balance: ${user.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
          )}
          {user && (user.role === 'seller' || user.role === 'admin') && (
            <button onClick={() => navigate('/profile')} className="btn-secondary">
              Profile
            </button>
          )}
        </div>
      </nav>
      <div className="content">
        
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          {cartData.items.length > 0 && (
            <button onClick={clearCart} className="btn-secondary clear-cart-btn">
              Clear Cart
            </button>
          )}
        </div>

        {cartData.items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartData.items.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div className="cart-item-image">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.title} />
                    ) : (
                      <div className="cart-item-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="cart-item-details">
                    <h3>{item.product.title}</h3>
                    <p className="cart-item-category">{item.product.category?.name || 'Uncategorized'}</p>
                    <p className="cart-item-price">${item.product.price?.toFixed(2)}</p>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="cart-item-subtotal">
                      ${((item.product.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="btn-secondary remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                <h2>Total: ${cartData.totalPrice.toFixed(2)}</h2>
                {user && (
                  <p className="balance-info">
                    Your Balance: ${user.balance?.toFixed(2) || '0.00'}
                  </p>
                )}
              </div>
              <button 
                onClick={handleCheckout} 
                className="btn-primary checkout-btn"
                disabled={checkingOut || (user && user.balance < cartData.totalPrice)}
              >
                {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        )}
        
        {/* Order Status Section */}
        <div className="order-status-section">
          <h2>Order Status</h2>
          {ordersLoading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-header">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="order-total">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item._id} className="order-product">
                        <div className="order-product-image">
                          {item.productId?.imageUrl ? (
                            <img src={item.productId.imageUrl} alt={item.productId.title} />
                          ) : (
                            <div className="order-product-placeholder">
                              <span>No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="product-info">
                          <span className="product-name">
                            {item.productId?.title || 'Product'}
                          </span>
                          <span className="product-quantity">Qty: {item.quantity}</span>
                          <span className="product-price">${item.price.toFixed(2)}</span>
                        </div>
                        <div className="status-controls">
                          {(user.role === 'seller' || user.role === 'admin') && 
                           (String(user._id) === String(item.sellerId) || user.role === 'admin') ? (
                            <select 
                              value={item.status}
                              onChange={(e) => updateOrderStatus(order._id, item._id, e.target.value)}
                              className="status-select"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Refunded">Refunded</option>
                            </select>
                          ) : (
                            <span className={`status-badge status-${item.status.toLowerCase()}`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;