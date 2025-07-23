import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Settings</h1>
        <p className="text-gray-500 text-base mb-8 text-center">
          Adjust your dashboard preferences and configurations here.
        </p>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col items-start">
            <span className="text-gray-700 font-semibold">Theme:</span>
            <span className="text-gray-900">Light / Dark</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-gray-700 font-semibold">Notifications:</span>
            <span className="text-gray-900">Enabled</span>
          </div>
          {/* Add more settings fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 