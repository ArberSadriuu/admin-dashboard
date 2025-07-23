import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import DataTablePage from './pages/DataTablePage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotFound from './pages/NotAuthorized';
import AnalyticsPage from './pages/AnalyticsPage';

// PrivateRoute wrapper
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// AppRoutes component to conditionally render routes based on user role
const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
      <Route path="/table" element={<PrivateRoute><DataTablePage /></PrivateRoute>} />
      {user?.role === 'admin' && (
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
      )}
      <Route path="/profile" element={user?.role === 'admin' ? <PrivateRoute><ProfilePage /></PrivateRoute> : <NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// MainLayout: gradient background, white sidebar/topbar, no dark mode
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  if (!user || isLogin) {
    return <>{children}</>;
  }
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <aside className="w-64 min-h-screen bg-white shadow-lg z-10">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow flex items-center z-10">
          <Topbar />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

