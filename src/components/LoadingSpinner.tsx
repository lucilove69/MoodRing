import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <img src="/images/loading.gif" alt="Loading..." className="h-16 mx-auto mb-2" />
        <p className="font-bold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;