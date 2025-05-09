import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Music, Image, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Emoji from './Emoji';
import Post from './Post';
import CreatePost from './CreatePost';
import Loading from './Loading';
import { useToast } from './Toast';
import Button from './Button';

interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  media?: {
    type: 'image' | 'music' | 'link';
    url: string;
  };
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  userAvatar: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  images?: string[];
  createdAt: Date;
  isLiked?: boolean;
}

interface FeedProps {
  posts: Post[];
  onLoadMore: () => Promise<void>;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string) => void;
  onCreatePost: (data: { content: string; images: File[] }) => Promise<void>;
  onRefresh?: () => Promise<void>;
  hasMore: boolean;
  className?: string;
  error?: string;
}

const Feed: React.FC<FeedProps> = ({
  posts,
  onLoadMore,
  onLike,
  onComment,
  onShare,
  onDelete,
  onEdit,
  onCreatePost,
  onRefresh,
  hasMore,
  className = '',
  error,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    try {
      setIsLoading(true);
      await onLoadMore();
      setRetryCount(0); // Reset retry count on successful load
    } catch (error) {
      showToast('Failed to load more posts', 'error');
      setRetryCount(prev => prev + 1);
      
      // Auto-retry with exponential backoff
      if (retryCount < 3) {
        setTimeout(() => {
          loadMore();
        }, Math.min(1000 * Math.pow(2, retryCount), 10000));
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, onLoadMore, retryCount, showToast]);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh || isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      await onRefresh();
      showToast('Feed refreshed', 'success');
    } catch (error) {
      showToast('Failed to refresh feed', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing, showToast]);

  const handleCreatePost = async (data: { content: string; images: File[] }) => {
    if (!user) {
      showToast('Please sign in to create a post', 'error');
      return;
    }

    try {
      setIsCreating(true);
      await onCreatePost(data);
      showToast('Post created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create post', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore]);

  const renderMedia = (media: Post['media']) => {
    if (!media) return null;

    switch (media.type) {
      case 'image':
        return (
          <div className="relative group">
            <img
              src={media.url}
              alt="Post media"
              className="w-full rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.2)]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm" />
          </div>
        );
      case 'music':
        return (
          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.2)]">
            <div className="flex items-center space-x-3">
              <Emoji type="music" size="lg" />
              <div className="flex-1">
                <p className="text-white font-bold">Now Playing</p>
                <p className="text-white/80 text-sm">{media.url}</p>
              </div>
            </div>
          </div>
        );
      case 'link':
        return (
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            <LinkIcon size={20} className="text-[#00FFFF]" />
            <span className="text-white">{media.url}</span>
          </a>
        );
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          variant="primary"
          onClick={handleRefresh}
          disabled={isRefreshing}
          icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
        >
          {isRefreshing ? 'Refreshing...' : 'Try Again'}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Feed</h2>
        {onRefresh && (
          <Button
            variant="ghost"
            onClick={handleRefresh}
            disabled={isRefreshing}
            icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        )}
      </div>

      {user && (
        <CreatePost
          onSubmit={handleCreatePost}
          className="mb-6"
        />
      )}

      {posts.length === 0 && !isLoading ? (
        <div className="text-center py-8 text-white/50">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            {...post}
            onLike={() => onLike(post.id)}
            onComment={() => onComment(post.id)}
            onShare={() => onShare(post.id)}
            onDelete={() => onDelete(post.id)}
            onEdit={() => onEdit(post.id)}
          />
        ))
      )}

      <div ref={loadMoreRef} className="py-4">
        {isLoading && (
          <div className="flex justify-center">
            <Loading size="small" text="Loading more posts..." />
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Loading size="large" text="Creating post..." />
        </div>
      )}
    </div>
  );
};

export default Feed; 