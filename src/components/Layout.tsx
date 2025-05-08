import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow px-4 py-6 bg-[url('/images/page-bg.gif')]">
        <div className="max-w-6xl mx-auto bg-white border-2 border-black shadow-lg p-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;