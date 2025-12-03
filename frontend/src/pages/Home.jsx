import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Product Store</h1>
        <div className="nav-links">
          {user ? (
            <>
              <span>Welcome, {user.userName}!</span>
              {(user.role === 'seller' || user.role === 'admin') && (
                <button onClick={() => navigate('/my-products')} className="btn-secondary">
                  My Products
                </button>
              )}
              <button onClick={logout} className="btn-secondary">
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
        <h2>Welcome to Product Store</h2>
        <p>Browse and manage products</p>
      </div>
    </div>
  );
};

export default Home;
