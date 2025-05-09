import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { z } from 'zod';

interface Post {
  id: string;
  content: string;
  mood?: string;
  media?: Array<{
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
    duration?: number;
  }>;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  tags?: string[];
  mentions?: string[];
  poll?: {
    question: string;
    options: string[];
    duration: number;
  };
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

interface GroupPostsProps {
  groupId: string;
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most_liked', label: 'Most Liked' },
  { value: 'most_commented', label: 'Most Commented' },
];

const filterOptions = [
  { value: 'all', label: 'All Posts' },
  { value: 'text', label: 'Text Only' },
  { value: 'media', label: 'With Media' },
  { value: 'polls', label: 'Polls' },
];

export default function GroupPosts({ groupId }: GroupPostsProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [newPost, setNewPost] = useState({
    content: '',
    mood: '',
  });

  const fetchPosts = async (pageNum: number, sort: string, filter: string) => {
    try {
      const response = await fetch(
        `/api/groups/${groupId}/posts?page=${pageNum}&sort=${sort}&filter=${filter}`
      );
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(pageNum === 1 ? data.posts : [...posts, ...data.posts]);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(1, sortBy, filterBy);
  }, [groupId, sortBy, filterBy]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, sortBy, filterBy);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    try {
      const response = await fetch(`/api/groups/${groupId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error('Failed to create post');
      const createdPost = await response.json();
      setPosts([createdPost, ...posts]);
      setNewPost({ content: '', mood: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like post');
      const updatedPost = await response.json();
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, _count: updatedPost._count } : post
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading && page === 1) {
    return <div className="p-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Post Creation Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="What's on your mind?"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex justify-between items-center">
            <select
              value={newPost.mood}
              onChange={(e) => setNewPost({ ...newPost, mood: e.target.value })}
              className="p-2 border rounded-lg"
            >
              <option value="">Select Mood</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="excited">🤩 Excited</option>
              <option value="angry">😠 Angry</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Filters and Sort */}
      <div className="flex justify-between items-center">
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-sm font-bold">
                    {post.author.username[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{post.author.username}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </p>
                  </div>
                  {post.mood && (
                    <span className="text-2xl" role="img" aria-label={post.mood}>
                      {post.mood === 'happy' && '😊'}
                      {post.mood === 'sad' && '😢'}
                      {post.mood === 'excited' && '🤩'}
                      {post.mood === 'angry' && '😠'}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-gray-800">{post.content}</p>
                {post.media && post.media.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {post.media.map((item, index) => (
                      <div key={index} className="relative">
                        {item.type === 'image' && (
                          <img
                            src={item.url}
                            alt=""
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}
                        {item.type === 'video' && (
                          <video
                            src={item.url}
                            poster={item.thumbnail}
                            controls
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}
                        {item.type === 'audio' && (
                          <audio
                            src={item.url}
                            controls
                            className="w-full"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {post.poll && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">{post.poll.question}</h4>
                    <div className="space-y-2">
                      {post.poll.options.map((option, index) => (
                        <button
                          key={index}
                          className="w-full p-2 text-left bg-white border rounded-lg hover:bg-gray-50"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                  >
                    <span>❤️</span>
                    <span>{post._count.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                    <span>💬</span>
                    <span>{post._count.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
} 