import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IntegrationsPage from './pages/IntegrationsPage';
import LiveOperationsPage from './pages/LiveOperationsPage';
import DriverPerformancePage from './pages/DriverPerformancePage';
import RevenuePage from './pages/RevenuePage';
import LeakagePage from './pages/LeakagePage';
import AlertsCenterPage from './pages/AlertsCenterPage';
import FleetHealthPage from './pages/FleetHealthPage';
import ComingSoonPage from './pages/ComingSoonPage';

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
              <Route path="/dashboard"          element={<DashboardPage />} />
              <Route path="/live-operations"    element={<LiveOperationsPage />} />
              <Route path="/driver-performance" element={<DriverPerformancePage />} />
              <Route path="/revenue"            element={<RevenuePage />} />
              <Route path="/leakage"            element={<LeakagePage />} />
              <Route path="/alerts"             element={<AlertsCenterPage />} />
              <Route path="/fleet-health"       element={<FleetHealthPage />} />
              <Route path="/integrations"       element={<IntegrationsPage />} />
              <Route path="/drivers"            element={<ComingSoonPage />} />
              <Route path="/cars"               element={<ComingSoonPage />} />
              <Route path="/settings"           element={<ComingSoonPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
