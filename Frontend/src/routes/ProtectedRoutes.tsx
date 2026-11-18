// src/routes/ProtectedRoutes.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRoutesProps {
  isAuthenticated: boolean;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ isAuthenticated }) => {
  // If user is NOT logged in, redirect to /auth
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoutes;