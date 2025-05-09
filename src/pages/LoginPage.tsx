import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="bg-blue-100 border-2 border-blue-400 rounded p-4 mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">Member Login</h1>
          <p className="text-sm text-center">Sign in to see your friends, photos, and more!</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-800 p-3 mb-4 text-center">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-400 rounded p-6">
          <table className="table-layout">
            <tbody>
              <tr>
                <td className="font-bold">Email:</td>
                <td>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="myspace-input w-full"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="font-bold">Password:</td>
                <td>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="myspace-input w-full"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="text-center pt-4">
                  <button 
                    type="submit" 
                    className="myspace-button w-full"
                  >
                    Log In
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        
        <div className="mt-6 text-center">
          <p className="mb-2">Don't have an account?</p>
          <Link to="/register" className="myspace-button inline-block">
            Sign Up for MoodRing
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <img src="/images/browser-icons.gif" alt="Browser compatibility" className="h-8 mx-auto" />
          <p className="text-xs mt-2">MoodRing works best with Internet Explorer and Netscape</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;