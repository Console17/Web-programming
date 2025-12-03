import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('');

  useEffect(() => {
    loadProducts();
  }, [page, sort]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getProducts(page, 12, sort);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Product Store</h1>
        <div className="nav-links">
          {user ? (
            <>
              <span>Welcome, {user.userName}!</span>
              {(user.role === 'seller' || user.role === 'admin') && (
                <>
                  <button onClick={() => navigate('/my-products')} className="btn-secondary">
                    My Products
                  </button>
                  <button onClick={() => navigate('/create')} className="btn-primary">
                    Add Product
                  </button>
                </>
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
        <div className="products-header">
          <h2>All Products</h2>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
            <option value="">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="titleAsc">Title: A-Z</option>
            <option value="titleDesc">Title: Z-A</option>
          </select>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <p className="no-products">No products available</p>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
