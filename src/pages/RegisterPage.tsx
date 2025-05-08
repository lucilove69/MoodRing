import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  const [passwordMatch, setPasswordMatch] = useState(true);
  const { register, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const { firstName, lastName, email, username, password, confirmPassword } = formData;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      if (e.target.name === 'confirmPassword') {
        setPasswordMatch(password === e.target.value);
      } else {
        setPasswordMatch(confirmPassword === e.target.value);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    try {
      await register({
        firstName,
        lastName,
        email,
        username,
        password,
        profileUrl: username, // Set profile URL to username
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        profileViews: 0,
        status: 'New to MySpace',
        mood: 'Happy',
        customCSS: '',
        customHTML: '<div class="myspace-default">Welcome to my profile!</div>',
        profileSong: '',
        about: '',
        interests: '',
        photos: [],
        friends: ['tom'], // Everyone's first friend is Tom
        topFriends: ['tom'],
        pendingFriends: [],
        comments: [],
        bulletins: [],
      });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="bg-blue-100 border-2 border-blue-400 rounded p-4 mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">Join MySpace Today!</h1>
          <p className="text-sm text-center">Sign up to connect with friends, share photos, and create your own space!</p>
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
                <td className="font-bold">First Name:</td>
                <td>
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                    className="myspace-input w-full"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="font-bold">Last Name:</td>
                <td>
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                    className="myspace-input w-full"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="font-bold">Email:</td>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="myspace-input w-full"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="font-bold">Username:</td>
                <td>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    className="myspace-input w-full"
                    required
                  />
                  <p className="text-xs mt-1">This will be your profile URL: myspace.com/{username}</p>
                </td>
              </tr>
              <tr>
                <td className="font-bold">Password:</td>
                <td>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className="myspace-input w-full"
                    required
                    minLength={6}
                  />
                </td>
              </tr>
              <tr>
                <td className="font-bold">Confirm Password:</td>
                <td>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    className={`myspace-input w-full ${!passwordMatch ? 'border-red-500' : ''}`}
                    required
                  />
                  {!passwordMatch && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="text-center pt-4">
                  <button 
                    type="submit" 
                    className="myspace-button w-full"
                    disabled={!passwordMatch}
                  >
                    Create Account
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        
        <div className="mt-6 text-center">
          <p className="mb-2">Already have an account?</p>
          <Link to="/login" className="myspace-button inline-block">
            Log In to MySpace
          </Link>
        </div>
        
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 p-4 text-sm">
          <h3 className="font-bold mb-2">Why Join MySpace?</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Connect with friends and meet new people</li>
            <li>Share photos and music</li>
            <li>Customize your profile with HTML and CSS</li>
            <li>Create your own unique space on the web</li>
            <li>Join the fastest growing community online!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;