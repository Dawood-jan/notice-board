// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token || auth.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
