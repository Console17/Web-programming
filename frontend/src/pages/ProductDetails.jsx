import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api/products';
import { cartAPI } from '../api/cart';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      
      await cartAPI.addToCart(product._id, quantity);
      
      alert(`Added ${quantity} ${product.title} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = error.response?.data?.message || 'Failed to add to cart';
      alert(message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-page">{error}</div>;
  if (!product) return <div className="error-page">Product not found</div>;

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
          <button onClick={() => navigate('/cart')} className="btn-secondary">
            Cart
          </button>
          {user && (
            <button onClick={() => navigate('/profile')} className="btn-secondary">
              Profile
            </button>
          )}
        </div>
        <div className="nav-center">
          {user && (
            <div className="balance-container">
              <div className="balance-display">
                Balance: ${user.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="content">
        
        <div className="product-details-layout">
          <div className="product-details-image">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} />
            ) : (
              <div className="product-image-placeholder">
                <span>No Image</span>
              </div>
            )}
          </div>
          
          <div className="product-details-container">
            <div className="product-info">
              <h1 className="product-title">{product.title}</h1>
              <p className="product-category">{product.category}</p>
              <p className="product-price">${product.price?.toFixed(2)}</p>
              
              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
              
              {product.quantity && (
                <div className="product-stock">
                  <p>In Stock: {product.quantity}</p>
                </div>
              )}
              
              {product.seller && (
                <div className="product-seller">
                  <p>Seller: {product.seller.userName || product.seller.email}</p>
                </div>
              )}
            </div>
            
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.quantity || 999}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="quantity-input"
                />
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn-primary add-to-cart-btn"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About</h3>
              <p>This platform connects buyers and sellers in one easy-to-use marketplace.</p>
            </div>
            <div className="footer-section">
              <h3>Links</h3>
              <ul className="footer-links">
                <li><button onClick={() => navigate('/about')} className="footer-link">About Us</button></li>
                <li><button onClick={() => navigate('/contact')} className="footer-link">Contact</button></li>
                <li><button onClick={() => navigate('/terms')} className="footer-link">Terms & Conditions</button></li>
                <li><button onClick={() => navigate('/privacy')} className="footer-link">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProductDetails;
