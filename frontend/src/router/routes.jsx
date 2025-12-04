import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import ProductDetails from '../pages/ProductDetails';
import MyProducts from '../pages/MyProducts';
import CreateProduct from '../pages/CreateProduct';
import EditProduct from '../pages/EditProduct';
import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      
      {/* Protected routes - Seller and Admin only */}
      <Route 
        path="/my-products" 
        element={
          <ProtectedRoute requiredRole={['seller', 'admin']}>
            <MyProducts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create" 
        element={
          <ProtectedRoute requiredRole={['seller', 'admin']}>
            <CreateProduct />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit/:id" 
        element={
          <ProtectedRoute requiredRole={['seller', 'admin']}>
            <EditProduct />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
