import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Terms = () => {
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
          <h1 className="info-title">Terms & Conditions</h1>
          <div className="info-content">
            <p>
              By using this website, you agree to the following terms and conditions.
            </p>
            <p>
              This platform is a demonstration project created for educational purposes only. Products, orders, and transactions displayed on the website are not real and do not involve actual payments. This website is not intended for commercial use.
            </p>
            <p>
              Users are responsible for the information they provide when creating accounts or listings. We reserve the right to remove content that violates platform rules or is inappropriate.
            </p>
            <p>
              The platform is provided "as is" without warranties of any kind.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;