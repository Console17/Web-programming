import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(storage.getToken());

  // Load current user on mount
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = storage.getToken();
      const savedUser = storage.getUser();

      if (savedToken) {
        try {
          // Verify token and get fresh user data
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setToken(savedToken);
        } catch (error) {
          console.error('Failed to load user:', error);
          // Token is invalid, clear storage
          storage.clearAuth();
          setUser(null);
          setToken(null);
        }
      } else if (savedUser) {
        // Have user data but no token, clear it
        storage.clearAuth();
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const data = await authAPI.signIn(email, password);
      
      // Store token and user info
      storage.setToken(data.token);
      setToken(data.token);
      
      // Get current user data
      const userData = await authAPI.getCurrentUser();
      storage.setUser(userData);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (userName, email, password, role = 'user') => {
    try {
      const data = await authAPI.signUp(userName, email, password, role);
      
      // Store token
      storage.setToken(data.token);
      setToken(data.token);
      
      // Get current user data
      const userData = await authAPI.getCurrentUser();
      storage.setUser(userData);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    storage.clearAuth();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'seller' || user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
