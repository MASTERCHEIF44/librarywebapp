// src/components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Only render children if the user exists and has an admin role.
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;