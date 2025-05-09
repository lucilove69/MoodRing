import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Home, User, Mail, Music, Image, Settings, LogOut, Bell, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { useWindowSize } from '../hooks/useWindowSize';
import { useToast } from './Toast';
import Button from './Button';
import Avatar from './Avatar';
import { useSession } from 'next-auth/react';
import NotificationBadge from './Notifications/NotificationBadge';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { state: { currentUser: user }, dispatch } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { width } = useWindowSize();
  const { data: session } = useSession();

  // Keyboard shortcuts
  useKeyboardShortcut('ctrl+/', () => setIsSidebarOpen(!isSidebarOpen));
  useKeyboardShortcut('ctrl+b', () => toggleTheme());
  useKeyboardShortcut('ctrl+h', () => navigate('/'));
  useKeyboardShortcut('ctrl+p', () => navigate('/profile'));
  useKeyboardShortcut('ctrl+m', () => navigate('/messages'));
  useKeyboardShortcut('ctrl+s', () => setIsSettingsOpen(!isSettingsOpen));

  const handleLogout = async () => {
    try {
      dispatch({ type: 'SET_USER', payload: undefined });
      showToast('Logged out successfully', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Failed to logout', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">MoodRing</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link
                    href="/create"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Create Post
                  </Link>
                  <NotificationBadge />
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                    >
                      <img
                        src={session.user.image || '/default-avatar.png'}
                        alt={session.user.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium">
                        {session.user.name}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="min-h-screen bg-[#F0F2F5]">
          {/* Top Navigation Bar */}
          <nav className="bg-[#3B5998] text-white p-2">
            <div className="max-w-[1000px] mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-2xl font-bold">MySpace</Link>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search MySpace"
                    className="bg-white/10 text-white placeholder-white/50 px-3 py-1 rounded text-sm w-48"
                  />
                  <Search className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  icon={<Bell className="w-5 h-5" />}
                  onClick={() => navigate('/notifications')}
                >
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  icon={<Mail className="w-5 h-5" />}
                  onClick={() => navigate('/messages')}
                >
                  Messages
                </Button>
                <div className="flex items-center space-x-2">
                  <Avatar
                    src={user?.avatar}
                    alt={user?.displayName || ''}
                    size="small"
                    className="w-8 h-8"
                  />
                  <span className="text-sm">{user?.displayName}</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="max-w-[1000px] mx-auto mt-4">
            <div className="flex gap-4">
              {/* Left Sidebar */}
              {isSidebarOpen && (
                <div className="w-48 bg-white rounded-lg shadow p-4">
                  <nav className="space-y-2">
                    <Link
                      to="/"
                      className="flex items-center space-x-2 p-2 hover:bg-[#E9EBEE] rounded"
                    >
                      <Home className="w-5 h-5" />
                      <span>Home</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 p-2 hover:bg-[#E9EBEE] rounded"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/photos"
                      className="flex items-center space-x-2 p-2 hover:bg-[#E9EBEE] rounded"
                    >
                      <Image className="w-5 h-5" />
                      <span>Photos</span>
                    </Link>
                    <Link
                      to="/music"
                      className="flex items-center space-x-2 p-2 hover:bg-[#E9EBEE] rounded"
                    >
                      <Music className="w-5 h-5" />
                      <span>Music</span>
                    </Link>
                    <button
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      className="flex items-center space-x-2 p-2 hover:bg-[#E9EBEE] rounded w-full text-left"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 p-2 hover:bg-[#E9EBEE] rounded w-full text-left text-red-500"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </nav>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-[#DADDE1]">
                    <h3 className="text-sm font-bold text-[#3B5998] mb-2">Quick Stats</h3>
                    <div className="space-y-1 text-sm">
                      <p>Friends: {user?.friends.length || 0}</p>
                      <p>Messages: 5</p>
                      <p>Photos: 45</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <div className="flex-1">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold text-[#3B5998] mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={() => toggleTheme()}
                  className="w-full p-2 border border-[#DADDE1] rounded"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Email notifications
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Friend requests
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Messages
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} MoodRing. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;