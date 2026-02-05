import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api/products';
import { authAPI } from '../api/auth';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ContactMessages from '../components/ContactMessages';
import CategoryManagement from '../components/CategoryManagement';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddBalance = async () => {
    const amount = prompt('Enter amount to add to your balance:');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      try {
        await authAPI.deposit(parseFloat(amount));
        await refreshUser();
        alert(`Successfully added $${parseFloat(amount).toFixed(2)} to your balance!`);
      } catch (error) {
        console.error('Error adding balance:', error);
        alert('Failed to add balance');
      }
    }
  };

  useEffect(() => {
    // Only load products if user is seller or admin
    if (user && (user.role === 'seller' || user.role === 'admin')) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProducts = async () => {
    // Only sellers and admins can load products
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      setLoading(false);
      return;
    }
    
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
      <nav className="navbar">
        <div className="nav-left">
          <button onClick={() => navigate('/')} className="btn-secondary">
            Home
          </button>
          <button onClick={() => navigate('/shop')} className="btn-secondary">
            Shop
          </button>
        </div>
        <div className="nav-center">
          {user && (
            <div className="balance-container">
              <div className="balance-display">
                Balance: ${user.balance?.toFixed(2) || '0.00'}
              </div>
              <button onClick={handleAddBalance} className="add-balance-btn">
                + Add Balance
              </button>
            </div>
          )}
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
          {user ? (
            <>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-primary">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn-secondary">
                Register
              </button>
            </>
          )}
        </div>      </nav>
      <div className="content">
        
        <div className="profile-header">
          <div className="profile-icon">
            <img src="/assets/Vector.png" alt="Body" className="profile-body" />
            <img src="/assets/Vector-2.png" alt="Head" className="profile-head" />
          </div>
          <div className="profile-info">
            <h2>Profile</h2>
            <p className="username">{user?.userName || 'User'}</p>
            <p className="user-role">{user?.role || 'user'}</p>
          </div>
        </div>
        
        {/* Show product management for sellers and admins only */}
        {(user?.role === 'seller' || user?.role === 'admin') && (
          <>
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
          </>
        )}
        
        {/* Show welcome message and shop link for regular users */}
        {user?.role === 'user' && (
          <div className="user-welcome">
            <h3>Welcome to your profile!</h3>
            <p>Manage your account information and explore our marketplace.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">
              Browse Products
            </button>
          </div>
        )}

        {/* Contact Messages - Admin Only */}
        {user?.role === 'admin' && (
          <div className="admin-section">
            <ContactMessages />
          </div>
        )}

        {/* Category Management - Admin Only */}
        {user?.role === 'admin' && (
          <div className="admin-section">
            <CategoryManagement />
          </div>
        )}

        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, product: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteModal.product?.title}"? This action cannot be undone.`}
        />
        
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

export default Profile;
