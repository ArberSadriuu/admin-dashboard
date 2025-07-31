import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';

  if (isLogin || isRegister) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <AnalyticsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/data-table"
        element={
          <PrivateRoute>
            <DataTablePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// MainLayout: modern gradient background, professional sidebar/topbar
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  
  if (!user || isLogin || isRegister) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <aside className="w-72 min-h-screen bg-white/80 backdrop-blur-xl shadow-xl border-r border-white/20">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20">
          <Topbar />
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;

