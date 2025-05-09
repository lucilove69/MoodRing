import React from 'react';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.posts.map(post => (
          <div
            key={post.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.displayName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-white font-semibold">{post.author.displayName}</h3>
                <p className="text-white/50 text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-white mb-4">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post attachment"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <div className="flex items-center space-x-4 text-white/70">
              <button className="flex items-center space-x-2 hover:text-white">
                <span>❤️</span>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-white">
                <span>💬</span>
                <span>{post.comments.length}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-white">
                <span>🔄</span>
                <span>{post.shares}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 