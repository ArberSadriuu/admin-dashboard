import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardIcon, 
  BarChartIcon, 
  TableIcon, 
  PersonIcon, 
  GearIcon,
  HomeIcon
} from '@radix-ui/react-icons';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
    description: 'Overview and key metrics'
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChartIcon,
    description: 'Data insights and reports'
  },
  {
    name: 'Data Table',
    path: '/data-table',
    icon: TableIcon,
    description: 'Manage and view data'
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: PersonIcon,
    description: 'Your account settings'
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: GearIcon,
    description: 'System configuration'
  }
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <HomeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">NexBoard</h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto p-6">
        <div className="text-center">
          <p className="text-xs text-gray-500">© 2024 Admin Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 