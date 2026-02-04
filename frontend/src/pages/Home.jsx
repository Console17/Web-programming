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
          {user && (user.role === 'seller' || user.role === 'admin') && (
            <>
              <button onClick={() => navigate('/profile')} className="btn-secondary">
                Profile
              </button>
              <button onClick={() => navigate('/create')} className="btn-primary">
                Add Product
              </button>
            </>
          )}
        </div>
        <div className="nav-links">
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
        <div className="hero-content">
          <h1 className="hero-title">DISCOVER</h1>
          <h2 className="hero-subtitle">CURATED PRODUCTS</h2>
          <p className="hero-description">
            Explore our carefully selected collection of unique items
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/shop')} 
          className="shop-button"
        >
          GO TO SHOP
        </button>
      </div>
    </div>
  );
};

export default Home;
