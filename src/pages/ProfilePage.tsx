import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CommentsSection from '../components/CommentsSection';
import FriendsList from '../components/FriendsList';
import ProfileInfo from '../components/ProfileInfo';
import MusicPlayer from '../components/MusicPlayer';
import BulletinBoard from '../components/BulletinBoard';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/profile/${username}`);
        setProfileUser(res.data);
        
        // Track profile view if not the profile owner
        if (isAuthenticated && currentUser?.id !== res.data.id) {
          await api.post(`/users/view/${res.data.id}`);
        }
      } catch (err) {
        setError('Profile not found or error loading profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (username) {
      fetchProfile();
    }
  }, [username, currentUser?.id, isAuthenticated]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error || !profileUser) {
    return (
      <div className="text-center p-8">
        <img src="/images/404.gif" alt="404" className="h-32 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="mb-4">{error || 'The user you are looking for does not exist.'}</p>
        <Link to="/" className="myspace-button">Return Home</Link>
      </div>
    );
  }
  
  const isOwnProfile = currentUser?.id === profileUser.id;
  
  return (
    <div>
      {/* Custom CSS from user */}
      {profileUser.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: profileUser.customCSS }} />
      )}
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">{profileUser.firstName}'s Profile</h1>
          <p className="text-sm">
            <span className="font-bold">Mood:</span> {profileUser.mood}
          </p>
        </div>
        
        {isOwnProfile && (
          <Link to="/edit-profile" className="myspace-button">
            Edit My Profile
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="border-2 border-gray-400 p-4 mb-6">
            <div className="text-center mb-4">
              <img 
                src={`/images/user-avatars/${profileUser.id}.jpg`} 
                alt={`${profileUser.firstName} ${profileUser.lastName}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/default-avatars/avatar1.jpg';
                }}
                className="w-40 h-40 mx-auto border-4 border-gray-500"
              />
              <p className="font-bold mt-2">
                {profileUser.firstName} {profileUser.lastName}
              </p>
              <p className="text-xs">{profileUser.status}</p>
            </div>
            
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-bold">Gender:</td>
                  <td>Unspecified</td>
                </tr>
                <tr>
                  <td className="font-bold">Age:</td>
                  <td>Unspecified</td>
                </tr>
                <tr>
                  <td className="font-bold">Last Login:</td>
                  <td>{new Date(profileUser.lastLogin).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="font-bold">View Count:</td>
                  <td>
                    <div className="flex items-center">
                      <span>{profileUser.profileViews}</span>
                      <img src="/images/view-counter.gif" alt="Views" className="h-4 ml-1" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <MusicPlayer url={profileUser.profileSong} />
          
          <FriendsList 
            friends={profileUser.topFriends} 
            title="Tom's Top 8" 
            isEditMode={false}
          />
        </div>
        
        <div className="md:col-span-2">
          <div 
            className="profile-content border-2 border-gray-400 p-4 mb-6"
            dangerouslySetInnerHTML={{ __html: profileUser.customHTML }}
          />
          
          <ProfileInfo user={profileUser} />
          
          <BulletinBoard bulletins={profileUser.bulletins} isOwnProfile={isOwnProfile} />
          
          <CommentsSection
            comments={profileUser.comments}
            profileId={profileUser.id}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <img src="/images/counter.gif" alt="Counter" className="h-6 mx-auto" />
      </div>
    </div>
  );
};

export default ProfilePage;