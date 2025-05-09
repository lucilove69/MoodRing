import React from 'react';
import { useApp } from '../context/AppContext';

const Profile: React.FC = () => {
  const { state } = useApp();
  const user = state.currentUser;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-white/70">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-8 mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-24 h-24 rounded-full border-4 border-white/10"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{user.displayName}</h1>
              <p className="text-white/70">@{user.username}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-2xl font-bold text-white mb-1">{user.friends.length}</p>
              <p className="text-white/70">Friends</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-2xl font-bold text-white mb-1">
                {state.posts.filter(post => post.authorId === user.id).length}
              </p>
              <p className="text-white/70">Posts</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-2xl font-bold text-white mb-1">
                {state.messages.filter(msg => msg.senderId === user.id).length}
              </p>
              <p className="text-white/70">Messages</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {state.posts
              .filter(post => post.authorId === user.id)
              .slice(0, 5)
              .map(post => (
                <div
                  key={post.id}
                  className="bg-white/5 rounded-lg p-4"
                >
                  <p className="text-white mb-2">{post.content}</p>
                  <div className="flex items-center space-x-4 text-white/70 text-sm">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments.length}</span>
                    <span>🔄 {post.shares}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 