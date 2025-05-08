import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-12">
      <img src="/images/404.gif" alt="404" className="h-32 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="myspace-button inline-block">
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;