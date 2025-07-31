import React, { useState } from 'react';
import { 
  EyeOpenIcon, 
  EyeNoneIcon,
  GearIcon,
  GlobeIcon,
  LockClosedIcon,
  TrashIcon,
  DownloadIcon,
  Cross2Icon,
  PersonIcon,
  EyeOpenIcon as EyeOpenIcon2,
  EyeNoneIcon as EyeNoneIcon2
} from '@radix-ui/react-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SettingSection {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  settings: SettingItem[];
}

interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input' | 'button' | 'password';
  value?: any;
  options?: string[];
}

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [settings, setSettings] = useState({
    language: 'English',
    timezone: 'UTC',
    autoSave: true,
    dataExport: false,
    twoFactorAuth: false
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSelect = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setIsChangingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully!');
    }, 2000);
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    
    // Simulate 2FA setup
    setTimeout(() => {
      setIsEnabling2FA(false);
      setShow2FAModal(false);
      setSettings(prev => ({ ...prev, twoFactorAuth: true }));
      alert('Two-Factor Authentication enabled successfully!');
    }, 3000);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    // Simulate API call to delete account
    setTimeout(() => {
      // Clear all stored data
      localStorage.clear();
      sessionStorage.clear();
      
      // Logout and redirect
      logout();
      navigate('/login');
    }, 2000);
  };

  const settingSections: SettingSection[] = [
    {
      title: 'System',
      description: 'System and performance settings',
      icon: GearIcon,
      settings: [
        {
          id: 'timezone',
          label: 'Timezone',
          description: 'Set your local timezone',
          type: 'select',
          value: settings.timezone,
          options: ['UTC', 'EST', 'PST', 'GMT']
        },
        {
          id: 'autoSave',
          label: 'Auto Save',
          description: 'Automatically save your work',
          type: 'toggle',
          value: settings.autoSave
        }
      ]
    },
    {
      title: 'Security',
      description: 'Manage your account security settings',
      icon: LockClosedIcon,
      settings: [
        {
          id: 'changePassword',
          label: 'Change Password',
          description: 'Update your password to keep your account secure',
          type: 'button'
        },
        {
          id: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle',
          value: settings.twoFactorAuth
        }
      ]
    },
    {
      title: 'Data & Privacy',
      description: 'Manage your data and privacy settings',
      icon: LockClosedIcon,
      settings: [
        {
          id: 'dataExport',
          label: 'Data Export',
          description: 'Export your data for backup',
          type: 'button'
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <button
              onClick={() => handleToggle(item.id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[item.id as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[item.id as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );
      
      case 'select':
        return (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <select
              value={settings[item.id as keyof typeof settings] as string}
              onChange={(e) => handleSelect(item.id, e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {item.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      case 'button':
        return (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <button 
              onClick={() => {
                if (item.id === 'changePassword') {
                  setShowPasswordModal(true);
                } else if (item.id === 'dataExport') {
                  console.log('Exporting data...');
                  alert('Data export initiated');
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {item.id === 'changePassword' ? 'Update' : 'Export'}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and system configuration.</p>
        </div>
        <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2">
          <DownloadIcon className="w-4 h-4" />
          Export Settings
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <section.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {section.settings.map(renderSettingItem)}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <TrashIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Danger Zone</h3>
            <p className="text-sm text-gray-500">Irreversible and destructive actions</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end">
        <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200">
          Save Changes
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Cross2Icon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={isChangingPassword}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Enable Two-Factor Authentication</h3>
              <button
                onClick={() => setShow2FAModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Cross2Icon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockClosedIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Your Account</h4>
              <p className="text-gray-600">
                Two-factor authentication adds an extra layer of security to your account by requiring a second form of verification.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleEnable2FA}
                disabled={isEnabling2FA}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnabling2FA ? 'Setting up...' : 'Enable 2FA'}
              </button>
              <button
                onClick={() => setShow2FAModal(false)}
                disabled={isEnabling2FA}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Cross2Icon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h4>
              <p className="text-gray-600">
                This action cannot be undone. All your data, settings, and account information will be permanently deleted.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage; 