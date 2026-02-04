import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api/products';
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
      
      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(item => item.id === product._id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        const cartItem = {
          id: product._id,
          title: product.title,
          category: product.category,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: quantity
        };
        existingCart.push(cartItem);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      alert(`Added ${quantity} ${product.title} to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-page">{error}</div>;
  if (!product) return <div className="error-page">Product not found</div>;

  return (
    <div className="container">
      <div className="content">
        <button onClick={() => navigate('/shop')} className="btn-secondary back-btn">
          ← Back to Shop
        </button>
        
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
      </div>
    </div>
  );
};

export default ProductDetails;
