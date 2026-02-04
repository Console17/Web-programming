import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api/products';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getMyProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    navigate(`/edit/${product._id}`);
  };

  const handleDeleteClick = (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleDeleteConfirm = async () => {
    try {
      await productsAPI.deleteProduct(deleteModal.product._id);
      setProducts(products.filter(p => p._id !== deleteModal.product._id));
      setDeleteModal({ isOpen: false, product: null });
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="container">
      <div className="content">
        <button onClick={() => navigate('/')} className="btn-secondary back-btn">
          ← Back to Home
        </button>
        
        <div className="profile-header">
          <div className="profile-icon">
            <img src="/assets/Vector.png" alt="Body" className="profile-body" />
            <img src="/assets/Vector-2.png" alt="Head" className="profile-head" />
          </div>
          <div className="profile-info">
            <h2>Profile</h2>
            <p className="username">{user?.userName || 'User'}</p>
            <p className="user-role">{user?.role || 'user'}</p>
            <p className="user-balance">Balance: $1,250.00</p>
          </div>
        </div>
        
        <div className="products-header">
          <div className="products-header-left">
            <h3>My Products</h3>
            <button onClick={() => navigate('/create')} className="btn-small add-product-btn">
              + Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className="no-products">
            <p>You haven't created any products yet</p>
            <button onClick={() => navigate('/create')} className="btn-primary">
              Create Your First Product
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                showActions
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, product: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteModal.product?.title}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default Profile;
