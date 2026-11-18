// src/routes/AppRoutes.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import AppLayout from '../components/layout/AppLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';

// Protected Workspace Pages (Rendered inside AppLayout's <Outlet />)
import DashboardPage from '../pages/DashboardPage';
import TaskBoardPage from '../pages/TaskBoardPage';
import PartnerChatsPage from '../pages/PartnerChatPage';
import ProjectDiscoveryPage from '../pages/ProjectDiscoveryPage';
import RequestsInvitesPage from '../pages/RequestsInvitesPage';
import SettingsPage from '../pages/SettingsPage';

const AppRoutes: React.FC = () => {
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        {/* PROTECTED WORKSPACE ROUTES (Shared Sidebar + Header via <Outlet />) */}
        <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TaskBoardPage />} />
            <Route path="/chats" element={<PartnerChatsPage />} />
            <Route path="/discovery" element={<ProjectDiscoveryPage />} />
            <Route path="/requests" element={<RequestsInvitesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;