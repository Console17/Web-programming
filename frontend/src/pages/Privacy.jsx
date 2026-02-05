import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Privacy = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
              <button onClick={() => { logout(); navigate('/login'); }} className="btn-secondary">
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
      
      <div className="content">
        <div className="info-page">
          <h1 className="info-title">Privacy Policy</h1>
          <div className="info-content">
            <p>
              We respect your privacy and are committed to protecting your personal information.
            </p>
            <p>
              This website collects basic user data such as names, email addresses, and login credentials solely for the purpose of demonstrating authentication and e-commerce functionality. This website is not intended for commercial use.
            </p>
            <p>
              User data is not shared with third parties and is used only within the scope of this educational project.
            </p>
            <p>
              No real payment information is stored or processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;