// src/routes/AppRoutes.tsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import AppLayout from '../components/layout/AppLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';

// Protected Workspace Pages
import DashboardPage from '../pages/DashboardPage';
import TaskBoardPage from '../pages/TaskBoardPage';
import PartnerChatsPage from '../pages/PartnerChatPage';
import ProjectDiscoveryPage from '../pages/ProjectDiscoveryPage';
import RequestsInvitesPage from '../pages/RequestsInvitesPage';
import SettingsPage from '../pages/SettingsPage';

// 404 Page
import NotFoundPage from '../pages/NotFoundPage';

// Helper that redirects any unknown path to "/404" while preserving the attempted URL
const RedirectToNotFound: React.FC = () => {
  const location = useLocation();
  return (
    <Navigate
      to="/404"
      state={{ attemptedPath: location.pathname }}
      replace
    />
  );
};

const AppRoutes: React.FC = () => {
  // Replace with your real AuthContext / JWT state
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. PUBLIC ROUTES */}
        <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        {/* 2. PROTECTED WORKSPACE ROUTES (Shared Sidebar + Header via <Outlet />) */}
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

        {/* 3. DEDICATED 404 ROUTE */}
        <Route path="/404" element={<NotFoundPage />} />

        {/* 4. CATCH-ALL WILDCARD (Must stay last — redirects any unknown link to /404) */}
        <Route path="*" element={<RedirectToNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;