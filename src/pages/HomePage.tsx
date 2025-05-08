import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, Users, Music, Palette } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <div className="mb-6 text-center vista-window p-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Welcome to MoodRing
        </h1>
        <p className="text-xl mb-6">Express Your Digital Mood</p>
        
        {!isAuthenticated && (
          <div className="mt-4 space-x-4">
            <Link to="/register" className="vista-button">Create Account</Link>
            <Link to="/login" className="vista-button">Sign In</Link>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="vista-window p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold">Express Yourself</h2>
          </div>
          <p className="text-gray-700">
            Share your mood, customize your profile, and connect with friends who understand you.
          </p>
        </div>
        
        <div className="vista-window p-6">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold">Connect</h2>
          </div>
          <p className="text-gray-700">
            Find friends who share your vibe and build your digital circle.
          </p>
        </div>
        
        <div className="vista-window p-6">
          <div className="flex items-center mb-4">
            <Music className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold">Your Soundtrack</h2>
          </div>
          <p className="text-gray-700">
            Add music to your profile that matches your current mood.
          </p>
        </div>
        
        <div className="vista-window p-6">
          <div className="flex items-center mb-4">
            <Palette className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold">Customize</h2>
          </div>
          <p className="text-gray-700">
            Make your profile unique with custom HTML and CSS in true 2000s style.
          </p>
        </div>
      </div>
      
      {isAuthenticated && user && (
        <div className="mt-6 vista-window p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to={`/profile/${user.username}`} className="vista-button text-center">
              My Profile
            </Link>
            <Link to="/friends" className="vista-button text-center">
              Find Friends
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;