import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white/70 mb-8">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="inline-block bg-[var(--primary-color)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound; 