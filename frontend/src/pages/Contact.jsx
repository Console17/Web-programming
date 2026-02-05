import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ContactForm from '../components/ContactForm';

const Contact = () => {
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
          <h1 className="info-title">Contact Us</h1>
          <div className="info-content">
            <p>
              If you have any questions, feedback, or issues while using the platform, feel free to reach out.
            </p>
            <div className="contact-details">
              <h3>Contact details:</h3>
              <p>📧 Email: support@marketplace-demo.com</p>
              <p>📞 Phone: +995 --- -- -- --</p>
            </div>
            <div className="contact-form-section">
              <h3>Or use our contact form:</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;