// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ role, children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  if (Array.isArray(role) && !role.includes(auth.role)) {
    return <Navigate to="/login" />;
  }

  if (typeof role === "string" && auth.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};


export default ProtectedRoute;
