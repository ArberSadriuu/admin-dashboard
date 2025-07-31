import React from 'react';
import { PersonIcon } from '@radix-ui/react-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full flex items-center justify-end px-8 h-full">
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
        >
          <PersonIcon className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar; 