import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IntegrationsPage from './pages/IntegrationsPage';
import ComingSoonPage from './pages/ComingSoonPage';

const COMING_SOON_ROUTES = [
  '/live-operations',
  '/alerts',
  '/driver-performance',
  '/revenue',
  '/leakage',
  '/fleet-health',
  '/drivers',
  '/cars',
  '/settings',
];

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard"    element={<DashboardPage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />

              {COMING_SOON_ROUTES.map((path) => (
                <Route key={path} path={path} element={<ComingSoonPage />} />
              ))}
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
