import React from 'react';

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Not Found</h1>
    <p className="text-gray-700 dark:text-gray-300 text-lg">The page you are looking for does not exist.</p>
  </div>
);

export default NotFound; 