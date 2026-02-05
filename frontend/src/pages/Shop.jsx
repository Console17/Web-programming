import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';
import { categoriesAPI } from '../api/categories';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Shop = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    availability: '',
    alphabetical: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDropdowns, setFilterDropdowns] = useState({
    categories: false,
    priceRange: false,
    availability: false,
    alphabetical: false
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [page]);

  const loadCategories = async () => {
    try {
      const categoryData = await categoriesAPI.getAllCategories();
      setCategories(categoryData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getProducts(page, 12);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilterDropdown = (filterType) => {
    setFilterDropdowns(prev => {
      const newState = {
        categories: false,
        priceRange: false,
        availability: false,
        alphabetical: false
      };
      // Only open the clicked filter if it was previously closed
      if (!prev[filterType]) {
        newState[filterType] = true;
      }
      return newState;
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setFilterDropdowns(prev => ({
      ...prev,
      [filterType]: false
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      availability: '',
      alphabetical: ''
    });
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;
    if (filters.availability === 'in-stock' && product.stock <= 0) return false;
    if (filters.availability === 'out-of-stock' && product.stock > 0) return false;
    return true;
  }).sort((a, b) => {
    if (filters.alphabetical === 'a-z') {
      return a.title.localeCompare(b.title);
    } else if (filters.alphabetical === 'z-a') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-left">
          <button onClick={() => navigate('/')} className="btn-secondary">
            Home
          </button>
          {user && (
            <button onClick={() => navigate('/profile')} className="btn-secondary">
              Profile
            </button>
          )}
        </div>        <div class="nav-center">
          {user && (
            <div className="balance-container">
              <div className="balance-display">
                Balance: ${user.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
          )}
        </div>        <div className="nav-links">
          <button onClick={() => navigate('/cart')} className="btn-secondary">
            Cart
          </button>
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
      <div className="content">
        <div className="shop-layout">
          {/* Left Side Filters */}
          <div className="filters-section">
            <h2>Filters</h2>
            <div className="filters-container">
              {/* Categories Filter */}
              <div className="filter-item">
                <div 
                  className="filter-header" 
                  onClick={() => toggleFilterDropdown('categories')}
                >
                  <span className="filter-title">Categories</span>
                  <span className={`dropdown-arrow ${filterDropdowns.categories ? 'open' : ''}`}>▼</span>
                </div>
                {filterDropdowns.categories && (
                  <div className="filter-dropdown">
                    <div 
                      className="filter-option" 
                      onClick={() => handleFilterChange('category', '')}
                    >
                      All Categories
                    </div>
                    {categories.map(category => (
                      <div 
                        key={category._id} 
                        className="filter-option"
                        onClick={() => handleFilterChange('category', category.name)}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="filter-item">
                <div 
                  className="filter-header" 
                  onClick={() => toggleFilterDropdown('priceRange')}
                >
                  <span className="filter-title">Price Range</span>
                  <span className={`dropdown-arrow ${filterDropdowns.priceRange ? 'open' : ''}`}>▼</span>
                </div>
                {filterDropdowns.priceRange && (
                  <div className="filter-dropdown">
                    <div className="price-inputs">
                      <input 
                        type="number" 
                        placeholder="Min Price" 
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        className="price-input"
                      />
                      <input 
                        type="number" 
                        placeholder="Max Price" 
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        className="price-input"
                      />
                    </div>
                    <div className="filter-option" onClick={() => {handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', '');}}>Clear Price</div>
                  </div>
                )}
              </div>

              {/* Availability Filter */}
              <div className="filter-item">
                <div 
                  className="filter-header" 
                  onClick={() => toggleFilterDropdown('availability')}
                >
                  <span className="filter-title">Availability</span>
                  <span className={`dropdown-arrow ${filterDropdowns.availability ? 'open' : ''}`}>▼</span>
                </div>
                {filterDropdowns.availability && (
                  <div className="filter-dropdown">
                    <div 
                      className="filter-option" 
                      onClick={() => handleFilterChange('availability', '')}
                    >
                      All Products
                    </div>
                    <div 
                      className="filter-option" 
                      onClick={() => handleFilterChange('availability', 'in-stock')}
                    >
                      In Stock
                    </div>
                    <div 
                      className="filter-option" 
                      onClick={() => handleFilterChange('availability', 'out-of-stock')}
                    >
                      Out of Stock
                    </div>
                  </div>
                )}
              </div>

              {/* A-Z Filter */}
              <div className="filter-item">
                <div 
                  className="filter-header" 
                  onClick={() => toggleFilterDropdown('alphabetical')}
                >
                  <span className="filter-title">A-Z</span>
                  <span className={`dropdown-arrow ${filterDropdowns.alphabetical ? 'open' : ''}`}>▼</span>
                </div>
                {filterDropdowns.alphabetical && (
                  <div className="filter-dropdown">
                    <div 
                      className="filter-option" 
                      onClick={() => handleFilterChange('alphabetical', '')}
                    >
                      No Sorting
                    </div>
                    <div 
                      className="filter-option" 
                      onClick={() => handleFilterChange('alphabetical', 'a-z')}
                    >
                      A to Z
                    </div>
                    <div 
                      className="filter-option" 
                      onClick={() => handleFilterChange('alphabetical', 'z-a')}
                    >
                      Z to A
                    </div>
                  </div>
                )}
              </div>

              {/* Clear All Filters */}
              {(filters.category || filters.minPrice || filters.maxPrice || filters.availability || filters.alphabetical) && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Right Side Products */}
          <div className="products-section">
            <div className="products-header">
              <h2>All Products</h2>
            </div>
            
            {/* Search Bar */}
            <div className="products-search">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="products-search-input"
              />
            </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="no-products">
                <p>No products available</p>
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn-secondary"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        )}
          </div>
        </div>
      
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

export default Shop;