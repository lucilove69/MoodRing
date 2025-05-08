import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, LogIn, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[var(--myspace-blue)] text-white px-4 py-2 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-2 md:mb-0">
          <img src="/images/myspace-logo.png" alt="MySpace" className="h-10 mr-2" />
          <span className="font-bold text-xl">MySpace</span>
          <span className="text-xs ml-1">©2005</span>
        </div>

        <div className="flex space-x-4 text-sm">
          <Link to="/" className="flex items-center hover:bg-[var(--myspace-dark-blue)] px-2 py-1 rounded">
            <Home size={16} className="mr-1" />
            <span>Home</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to={`/profile/${user?.username}`} 
                className="flex items-center hover:bg-[var(--myspace-dark-blue)] px-2 py-1 rounded"
              >
                <User size={16} className="mr-1" />
                <span>My Profile</span>
              </Link>
              
              <Link 
                to="/friends" 
                className="flex items-center hover:bg-[var(--myspace-dark-blue)] px-2 py-1 rounded"
              >
                <Users size={16} className="mr-1" />
                <span>Friends</span>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center hover:bg-[var(--myspace-dark-blue)] px-2 py-1 rounded"
              >
                <LogOut size={16} className="mr-1" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center hover:bg-[var(--myspace-dark-blue)] px-2 py-1 rounded"
              >
                <LogIn size={16} className="mr-1" />
                <span>Login</span>
              </Link>
              
              <Link 
                to="/register" 
                className="flex items-center hover:bg-[var(--myspace-dark-blue)] px-2 py-1 rounded"
              >
                <UserPlus size={16} className="mr-1" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;