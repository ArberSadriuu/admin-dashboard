import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardIcon, TableIcon, GearIcon, BarChartIcon, PersonIcon } from '@radix-ui/react-icons';
import React from 'react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/analytics', label: 'Analytics', icon: <BarChartIcon /> },
  { to: '/table', label: 'Data Table', icon: <TableIcon /> },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;
  const isAdmin = user.role === 'admin';
  const location = useLocation();

  return (
    <nav className="h-full flex flex-col items-center py-8 px-4 bg-white rounded-r-2xl shadow-lg">
      <div className="mb-10 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
          <span className="text-xl font-bold text-blue-600">N</span>
        </div>
        <span className="text-lg font-extrabold text-blue-700 tracking-wide">NexBoard</span>
      </div>
      <ul className="w-full flex-1 flex flex-col gap-2">
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 w-full
                ${location.pathname === link.to ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
        {isAdmin && (
          <li className="mt-6">
            <div className="text-xs uppercase text-gray-400 mb-2 px-4">Admin Tools</div>
            <ul>
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 w-full
                    ${location.pathname === '/profile' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
                >
                  <span className="text-xl"><PersonIcon /></span>
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 w-full
                    ${location.pathname === '/settings' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`}
                >
                  <span className="text-xl"><GearIcon /></span>
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </li>
        )}
      </ul>
      <div className="mt-auto mb-4 text-xs text-gray-400 opacity-70">&copy; {new Date().getFullYear()} Admin Dashboard</div>
    </nav>
  );
};

export default Sidebar; 