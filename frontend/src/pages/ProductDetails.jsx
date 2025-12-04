import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-page">{error}</div>;
  if (!product) return <div className="error-page">Product not found</div>;

  return (
    <div className="container">
      <div className="content">
        <button onClick={() => navigate('/')} className="btn-secondary back-btn">
          ← Back to Products
        </button>
        
        <div className="product-details">
          {product.imageUrl && (
            <div className="product-details-image">
              <img src={product.imageUrl} alt={product.title} />
            </div>
          )}
          <div className="product-details-info">
            <h1>{product.title}</h1>
            <p className="product-category">{product.category}</p>
            <p className="product-price-large">${product.price.toFixed(2)}</p>
            <div className="product-description-full">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            {product.seller && (
              <div className="product-seller">
                <h3>Seller</h3>
                <p>{product.seller.userName || product.seller.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
