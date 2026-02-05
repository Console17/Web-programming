import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
          <button onClick={() => navigate('/cart')} className="btn-secondary">
            Cart
          </button>
          {user && (user.role === 'seller' || user.role === 'admin') && (
            <button onClick={() => navigate('/profile')} className="btn-secondary">
              Profile
            </button>
          )}
        </div>
      </nav>
      
      <div className="content">
        <div className="info-page">
          <h1 className="info-title">About Us</h1>
          <div className="info-content">
            <p>
              We are an online marketplace platform designed to connect buyers and sellers in one simple and secure environment. Our goal is to make online buying and selling accessible, efficient, and easy to use.
            </p>
            <p>
              This website was developed as part of a university web development project to demonstrate core e-commerce features such as user authentication, product management, and order processing.
            </p>
            <p>
              The platform allows sellers to create and manage product listings while giving buyers a smooth shopping experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;