import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-left">
          <button onClick={() => navigate('/')} className="btn-small home-btn">
            Home
          </button>
          <button onClick={() => navigate('/shop')} className="btn-small shop-nav-btn">
            Go to Shop
          </button>
        </div>
        <div className="nav-links">
          <button onClick={() => navigate('/cart')} className="btn-secondary">
            Cart
          </button>
          {user && (user.role === 'seller' || user.role === 'admin') && (
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
        </div>
      </nav>
      
      <div className="homepage">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Your Marketplace for Buying and Selling Online</h1>
            <p className="hero-subtext">
              A modern e-commerce platform where buyers discover great products and sellers manage their online stores with ease.
            </p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/shop')} className="btn-hero-primary">
                Browse Products
              </button>
              <button onClick={() => navigate('/register')} className="btn-hero-secondary">
                Become a Seller
              </button>
            </div>
          </div>
        </div>

        {/* Short Introduction */}
        <div className="intro-section">
          <div className="intro-content">
            <h2 className="intro-title">All-in-One Online Marketplace</h2>
            <p className="intro-text">
              This platform connects buyers and sellers in one simple and secure marketplace. Browse a wide range of products, compare prices, and shop with confidence — or sign up as a seller and start listing your products today.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works-section">
          <div className="section-content">
            <h2 className="section-title">How It Works</h2>
            <div className="how-it-works-grid">
              <div className="work-item">
                <h3 className="work-title">For Buyers</h3>
                <p className="work-text">
                  Browse products, add items to your cart, and place orders quickly and securely.
                </p>
              </div>
              <div className="work-item">
                <h3 className="work-title">For Sellers</h3>
                <p className="work-text">
                  Create product listings, update inventory, track orders, and manage your store from one dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="features-section">
          <div className="section-content">
            <h2 className="section-title">Platform Features</h2>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-text">User registration and authentication</span>
              </div>
              <div className="feature-item">
                <span className="feature-text">Product listing and management</span>
              </div>
              <div className="feature-item">
                <span className="feature-text">Shopping cart and checkout</span>
              </div>
              <div className="feature-item">
                <span className="feature-text">Order tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-text">Seller dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-text">
              Join our marketplace today — whether you're looking to buy great products or sell your own.
            </p>
            <div className="cta-buttons">
              <button onClick={() => navigate('/register')} className="btn-cta-primary">
                Create Account
              </button>
              <button onClick={() => navigate('/shop')} className="btn-cta-secondary">
                View Products
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="footer-content">
            <div className="footer-links">
              <button onClick={() => navigate('/about')} className="footer-link">
                About Us
              </button>
              <button onClick={() => navigate('/contact')} className="footer-link">
                Contact
              </button>
              <button onClick={() => navigate('/terms')} className="footer-link">
                Terms & Conditions
              </button>
              <button onClick={() => navigate('/privacy')} className="footer-link">
                Privacy Policy
              </button>
            </div>
            <p className="footer-text">
              Your trusted marketplace for online buying and selling.
            </p>
            <p className="footer-mini">
              © 2026 Marketplace Demo. All rights reserved. Educational project for university coursework.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
