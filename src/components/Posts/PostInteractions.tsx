import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';

interface PostInteractionsProps {
  postId: string;
  authorId: string;
  authorUsername: string;
  likes: number;
  comments: number;
  createdAt: string;
  onLike: () => Promise<void>;
  onComment: (content: string) => Promise<void>;
  onShare: () => Promise<void>;
}

export default function PostInteractions({
  postId,
  authorId,
  authorUsername,
  likes,
  comments,
  createdAt,
  onLike,
  onComment,
  onShare,
}: PostInteractionsProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    if (!session?.user) return;
    try {
      await onLike();
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onComment(commentContent);
      setCommentContent('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!session?.user) return;
    try {
      await onShare();
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{likes} likes</span>
          <span>{comments} comments</span>
        </div>
        <span>{formatDistanceToNow(new Date(createdAt))} ago</span>
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between border-t border-b py-2">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <span className="text-xl">❤️</span>
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-blue-500 rounded-lg transition-colors"
        >
          <span className="text-xl">💬</span>
          <span>Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-green-500 rounded-lg transition-colors"
        >
          <span className="text-xl">↗️</span>
          <span>Share</span>
        </button>
      </div>

      {/* Comment Form */}
      {showCommentForm && session?.user && (
        <form onSubmit={handleComment} className="space-y-2">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowCommentForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !commentContent.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 