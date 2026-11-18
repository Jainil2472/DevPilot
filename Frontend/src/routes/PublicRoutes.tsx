import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRoutesProps {
  isAuthenticated: boolean;
}

const PublicRoutes: React.FC<PublicRoutesProps> = ({ isAuthenticated }) => {
  // If user is already logged in, redirect away from Landing/Auth to Dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoutes;