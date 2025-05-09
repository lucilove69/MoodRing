import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLocalStorage } from '../utils/hooks';

interface AuthFormData {
  username: string;
  password: string;
  email?: string;
  displayName?: string;
}

const Auth: React.FC = () => {
  const { dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    password: '',
    email: '',
    displayName: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRecovering) {
        // Handle password recovery
        if (!formData.email) {
          throw new Error('Email is required for password recovery');
        }
        // TODO: Implement password recovery logic
        alert('Password recovery instructions have been sent to your email');
        setIsRecovering(false);
        return;
      }

      if (isLogin) {
        // Handle login
        if (!formData.username || !formData.password) {
          throw new Error('Username and password are required');
        }
        // TODO: Implement actual login logic
        const mockUser = {
          id: '1',
          username: formData.username,
          displayName: formData.username,
          avatar: '/default-avatar.png',
          status: 'online' as const,
          lastSeen: new Date(),
          friends: [],
          settings: {
            theme: {
              mode: 'dark' as const,
              primaryColor: '#00FFFF',
              secondaryColor: '#FF00FF',
              font: 'Comic Sans MS',
              customCSS: '',
            },
            privacy: {
              profileVisibility: 'public' as const,
              showOnlineStatus: true,
              allowFriendRequests: true,
              showLastSeen: true,
            },
            notifications: {
              email: true,
              push: true,
              friendRequests: true,
              messages: true,
              mentions: true,
            },
            emoticons: {
              size: 'medium' as const,
              allowCustomUploads: true,
              allowedTypes: ['gif', 'png', 'jpg', 'jpeg'] as ('gif' | 'png' | 'jpg' | 'jpeg')[],
            },
          },
        };
        dispatch({ type: 'SET_USER', payload: mockUser });
      } else {
        // Handle registration
        if (!formData.username || !formData.password || !formData.email || !formData.displayName) {
          throw new Error('All fields are required for registration');
        }
        // TODO: Implement actual registration logic
        const mockUser = {
          id: '1',
          username: formData.username,
          displayName: formData.displayName,
          avatar: '/default-avatar.png',
          status: 'online' as const,
          lastSeen: new Date(),
          friends: [],
          settings: {
            theme: {
              mode: 'dark' as const,
              primaryColor: '#00FFFF',
              secondaryColor: '#FF00FF',
              font: 'Comic Sans MS',
              customCSS: '',
            },
            privacy: {
              profileVisibility: 'public' as const,
              showOnlineStatus: true,
              allowFriendRequests: true,
              showLastSeen: true,
            },
            notifications: {
              email: true,
              push: true,
              friendRequests: true,
              messages: true,
              mentions: true,
            },
            emoticons: {
              size: 'medium' as const,
              allowCustomUploads: true,
              allowedTypes: ['gif', 'png', 'jpg', 'jpeg'] as ('gif' | 'png' | 'jpg' | 'jpeg')[],
            },
          },
        };
        dispatch({ type: 'SET_USER', payload: mockUser });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] mb-6 text-center">
            {isRecovering ? 'Recover Password' : isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#00FFFF] transition-colors duration-200"
                    placeholder="Enter your display name"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#00FFFF] transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-white/70 text-sm mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#00FFFF] transition-colors duration-200"
                placeholder="Enter your username"
              />
            </div>

            {!isRecovering && (
              <div>
                <label className="block text-white/70 text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#00FFFF] transition-colors duration-200"
                  placeholder="Enter your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isRecovering ? 'Send Recovery Email' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            {!isRecovering && (
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/70 hover:text-white text-sm"
              >
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
              </button>
            )}
            {isLogin && !isRecovering && (
              <button
                onClick={() => setIsRecovering(true)}
                className="block w-full text-white/70 hover:text-white text-sm"
              >
                Forgot your password?
              </button>
            )}
            {isRecovering && (
              <button
                onClick={() => setIsRecovering(false)}
                className="text-white/70 hover:text-white text-sm"
              >
                Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 