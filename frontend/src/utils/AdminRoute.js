import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, authLoading } = useContext(AuthContext);
  if (authLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;