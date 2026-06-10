import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
