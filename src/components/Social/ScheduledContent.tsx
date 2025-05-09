import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SUPPORTED_PLATFORMS, type SupportedPlatform } from '../../config/integrations';

interface ScheduledItem {
  id: string;
  content: {
    content: string;
    media?: Array<{
      type: 'image' | 'video' | 'audio';
      url: string;
      thumbnail?: string;
    }>;
    link?: string;
    title?: string;
  };
  platforms: SupportedPlatform[];
  scheduledFor: string;
  status: 'pending' | 'published' | 'failed';
  error?: string;
}

export default function ScheduledContent() {
  const { data: session } = useSession();
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchScheduledContent();
    }
  }, [session]);

  const fetchScheduledContent = async () => {
    try {
      const response = await fetch('/api/social/scheduled');
      if (!response.ok) throw new Error('Failed to fetch scheduled content');
      const data = await response.json();
      setScheduledItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/social/scheduled/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete scheduled content');

      setScheduledItems(items => items.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getPlatformIcon = (platform: SupportedPlatform) => {
    switch (platform) {
      case 'facebook':
        return '📘';
      case 'instagram':
        return '📸';
      case 'youtube':
        return '📺';
      case 'reddit':
        return '👽';
      default:
        return '🔗';
    }
  };

  const getStatusColor = (status: ScheduledItem['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'published':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return <div className="p-4">Loading scheduled content...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Scheduled Content</h2>

      {scheduledItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No scheduled content found
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledItems.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-lg border transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-gray-900">{item.content.content}</p>
                    {item.content.link && (
                      <a
                        href={item.content.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {item.content.link}
                      </a>
                    )}
                  </div>

                  {item.content.media && item.content.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {item.content.media.map((media, index) => (
                        <div key={index} className="relative">
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt=""
                              className="h-32 w-full object-cover rounded-lg"
                            />
                          ) : (
                            <video
                              src={media.url}
                              poster={media.thumbnail}
                              className="h-32 w-full object-cover rounded-lg"
                              controls
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {item.platforms.map(platform => (
                      <span
                        key={platform}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <span className="mr-1">{getPlatformIcon(platform)}</span>
                        {platform}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-500">
                      Scheduled for:{' '}
                      {new Date(item.scheduledFor).toLocaleString()}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.error && (
                    <p className="text-sm text-red-500">{item.error}</p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 