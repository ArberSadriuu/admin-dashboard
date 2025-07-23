import React from 'react';
import { SunIcon, MoonIcon, BellIcon } from '@radix-ui/react-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);
  const [hasNotification] = React.useState(false); // Placeholder for notification state

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle dark mode (for demo, just toggles state)
  const handleToggleDark = () => {
    setDarkMode((d) => !d);
    // You can integrate with your theme context here
  };

  return (
    <div className="w-full flex items-center justify-end px-8 h-16 bg-white rounded-t-2xl shadow">
      {/* Actions (right-aligned) */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button
          onClick={handleToggleDark}
          className="p-2 rounded-full hover:bg-blue-50 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <MoonIcon className="w-5 h-5 text-blue-600" />
          ) : (
            <SunIcon className="w-5 h-5 text-blue-600" />
          )}
        </button>
        {/* Notification icon */}
        <button
          className="relative p-2 rounded-full hover:bg-blue-50 transition"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5 text-blue-600" />
          {hasNotification && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        {/* Logout button */}
        {user && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar; 