import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Music, Image, Link as LinkIcon, Edit2 } from 'lucide-react';
import Avatar from './Avatar';
import Button from './Button';
import Feed from './Feed';
import { useToast } from './Toast';
import { useAuth } from '../hooks/useAuth';

interface ProfileProps {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  age?: number;
  gender?: string;
  orientation?: string;
  relationshipStatus?: string;
  interests?: string[];
  favoriteMusic?: string[];
  favoriteMovies?: string[];
  favoriteBooks?: string[];
  favoriteQuotes?: string[];
  topFriends?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  onEdit?: () => void;
  className?: string;
}

const Profile: React.FC<ProfileProps> = ({
  userId,
  username,
  displayName,
  avatar,
  bio,
  location,
  age,
  gender,
  orientation,
  relationshipStatus,
  interests,
  favoriteMusic,
  favoriteMovies,
  favoriteBooks,
  favoriteQuotes,
  topFriends,
  onEdit,
  className = '',
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const isOwnProfile = user?.id === userId;

  return (
    <div className={`max-w-[1000px] mx-auto ${className}`}>
      {/* Profile Header - Classic MySpace style */}
      <div className="bg-[#3B5998] text-white p-4 rounded-t-lg">
        <div className="flex items-start space-x-4">
          <Avatar
            src={avatar}
            alt={displayName}
            size="large"
            className="w-24 h-24 border-4 border-white"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              {isOwnProfile && (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  icon={<Edit2 className="w-4 h-4" />}
                >
                  Edit Profile
                </Button>
              )}
            </div>
            <p className="text-white/80">@{username}</p>
            {location && <p className="text-white/80">{location}</p>}
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex gap-4 mt-4">
        {/* Left Column - About Me, Details, etc. */}
        <div className="w-1/3 space-y-4">
          {/* About Me Box */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-lg font-bold mb-2 text-[#3B5998]">About Me</h2>
            <p className="text-gray-700">{bio || 'No bio yet.'}</p>
          </div>

          {/* Details Box */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-lg font-bold mb-2 text-[#3B5998]">Details</h2>
            <div className="space-y-2">
              {age && <p><span className="font-bold">Age:</span> {age}</p>}
              {gender && <p><span className="font-bold">Gender:</span> {gender}</p>}
              {orientation && <p><span className="font-bold">Orientation:</span> {orientation}</p>}
              {relationshipStatus && <p><span className="font-bold">Status:</span> {relationshipStatus}</p>}
            </div>
          </div>

          {/* Interests Box */}
          {interests && interests.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="text-lg font-bold mb-2 text-[#3B5998]">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-[#E9EBEE] text-[#3B5998] px-2 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Music Box */}
          {favoriteMusic && favoriteMusic.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="text-lg font-bold mb-2 text-[#3B5998]">Music</h2>
              <ul className="list-disc list-inside text-gray-700">
                {favoriteMusic.map((music, index) => (
                  <li key={index}>{music}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Movies Box */}
          {favoriteMovies && favoriteMovies.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="text-lg font-bold mb-2 text-[#3B5998]">Movies</h2>
              <ul className="list-disc list-inside text-gray-700">
                {favoriteMovies.map((movie, index) => (
                  <li key={index}>{movie}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Books Box */}
          {favoriteBooks && favoriteBooks.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="text-lg font-bold mb-2 text-[#3B5998]">Books</h2>
              <ul className="list-disc list-inside text-gray-700">
                {favoriteBooks.map((book, index) => (
                  <li key={index}>{book}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quotes Box */}
          {favoriteQuotes && favoriteQuotes.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="text-lg font-bold mb-2 text-[#3B5998]">Quotes</h2>
              <div className="space-y-2 text-gray-700">
                {favoriteQuotes.map((quote, index) => (
                  <p key={index} className="italic">"{quote}"</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Feed and Top Friends */}
        <div className="w-2/3 space-y-4">
          {/* Top Friends Box */}
          {topFriends && topFriends.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow mb-4">
              <h2 className="text-lg font-bold mb-2 text-[#3B5998]">Top Friends</h2>
              <div className="grid grid-cols-4 gap-4">
                {topFriends.map((friend) => (
                  <div key={friend.id} className="text-center">
                    <Avatar
                      src={friend.avatar}
                      alt={friend.name}
                      size="medium"
                      className="w-16 h-16 mx-auto mb-1"
                    />
                    <p className="text-sm text-gray-700 truncate">{friend.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feed */}
          <div className="bg-white rounded-lg p-4 shadow">
            <Feed
              posts={[]} // TODO: Implement posts fetching
              onLoadMore={async () => {}} // TODO: Implement load more
              onLike={() => {}} // TODO: Implement like
              onComment={() => {}} // TODO: Implement comment
              onShare={() => {}} // TODO: Implement share
              onDelete={() => {}} // TODO: Implement delete
              onEdit={() => {}} // TODO: Implement edit
              onCreatePost={async () => {}} // TODO: Implement create post
              hasMore={false} // TODO: Implement pagination
            />
          </div>
        </div>
      </div>

      {/* Custom CSS Box - Classic MySpace feature */}
      {isOwnProfile && (
        <div className="mt-4 bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold mb-2 text-[#3B5998]">Customize Profile</h2>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded"
            placeholder="Add your custom CSS here..."
            defaultValue=""
          />
          <div className="mt-2 flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 