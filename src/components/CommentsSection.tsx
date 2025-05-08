import React, { useState } from 'react';
import { Comment } from '../types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface CommentsSectionProps {
  comments: Comment[];
  profileId: string;
  isAuthenticated: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ 
  comments, 
  profileId, 
  isAuthenticated 
}) => {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const { user } = useAuth();
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !isAuthenticated || !user) {
      return;
    }
    
    try {
      const response = await api.post(`/users/comment/${profileId}`, {
        content: newComment,
        authorId: user.id
      });
      
      setLocalComments([response.data, ...localComments]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };
  
  return (
    <div className="border-2 border-gray-400 p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 text-[var(--myspace-blue)]">
        Comments <span className="text-sm font-normal">({localComments.length})</span>
      </h2>
      
      {isAuthenticated && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="mb-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="myspace-input w-full h-24"
              placeholder="Add a comment..."
            />
          </div>
          <div className="text-right">
            <button type="submit" className="myspace-button">
              Post Comment
            </button>
          </div>
        </form>
      )}
      
      {localComments.length === 0 ? (
        <p className="text-center italic text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {localComments.map((comment) => (
            <div 
              key={comment.id} 
              className="border border-gray-300 p-3 bg-gray-50"
            >
              <div className="flex mb-2">
                <img 
                  src={`/images/user-avatars/${comment.authorId}.jpg`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/default-avatars/avatar1.jpg';
                  }}
                  alt="User" 
                  className="w-10 h-10 mr-3 border border-gray-500" 
                />
                <div>
                  <p className="font-bold text-sm">{comment.authorId}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;