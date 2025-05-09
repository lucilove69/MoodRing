import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, LogIn, UserPlus, Users, Music, MessageSquare, Bell, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 text-white px-6 py-3 shadow-[0_2px_8px_rgba(0,255,255,0.2)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-3 md:mb-0">
          <img src="/images/moodring-logo.png" alt="MoodRing" className="h-12 mr-3 animate-pulse" />
          <span className="font-bold text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]">MoodRing</span>
          <span className="text-xs ml-2 opacity-75">2025</span>
        </div>

        {isAuthenticated && (
          <div className="w-full md:w-auto mb-3 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full md:w-64 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#00FFFF] focus:ring-2 focus:ring-[#00FFFF]/20 transition-all duration-200"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-white/50" />
            </div>
          </div>
        )}

        <div className="flex space-x-4 text-sm">
          <Link to="/" className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm">
            <Home size={18} className="mr-2" />
            <span className="font-bold">Home</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link 
                to={`/profile/${user?.username}`} 
                className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <User size={18} className="mr-2" />
                <span className="font-bold">My Profile</span>
              </Link>
              
              <Link 
                to="/friends" 
                className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <Users size={18} className="mr-2" />
                <span className="font-bold">Friends</span>
              </Link>

              <Link 
                to="/messages" 
                className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <MessageSquare size={18} className="mr-2" />
                <span className="font-bold">Messages</span>
              </Link>

              <Link 
                to="/music" 
                className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <Music size={18} className="mr-2" />
                <span className="font-bold">Music</span>
              </Link>

              <Link 
                to="/notifications" 
                className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <Bell size={18} className="mr-2" />
                <span className="font-bold">Alerts</span>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <LogOut size={18} className="mr-2" />
                <span className="font-bold">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <LogIn size={18} className="mr-2" />
                <span className="font-bold">Login</span>
              </Link>
              
              <Link 
                to="/register" 
                className="flex items-center hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <UserPlus size={18} className="mr-2" />
                <span className="font-bold">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;