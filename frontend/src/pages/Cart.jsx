import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [user, navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      // For now, load from localStorage as placeholder until cart API is implemented
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(savedCart);
      calculateTotal(savedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalAmount(0);
    localStorage.removeItem('cart');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    // TODO: Implement checkout functionality
    alert(`Proceeding to checkout with total: $${totalAmount.toFixed(2)}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div className="content">
        <button onClick={() => navigate('/shop')} className="btn-secondary back-btn">
          ← Back to Shop
        </button>
        
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="btn-secondary clear-cart-btn">
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
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
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} />
                    ) : (
                      <div className="cart-item-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">${item.price?.toFixed(2)}</p>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        −
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="cart-item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
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
                <h2>Total: ${totalAmount.toFixed(2)}</h2>
              </div>
              <button onClick={handleCheckout} className="btn-primary checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;