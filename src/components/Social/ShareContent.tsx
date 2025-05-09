import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { SUPPORTED_PLATFORMS, SHARING_FEATURES, type SupportedPlatform } from '../../config/integrations';

interface ShareContentProps {
  initialContent?: string;
  initialMedia?: Array<{
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
    duration?: number;
  }>;
  initialLink?: string;
  postId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ShareContent({
  initialContent = '',
  initialMedia = [],
  initialLink = '',
  postId,
  onSuccess,
  onCancel,
}: ShareContentProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState(initialContent);
  const [media, setMedia] = useState(initialMedia);
  const [link, setLink] = useState(initialLink);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SupportedPlatform[]>([]);
  const [schedule, setSchedule] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlatformToggle = (platform: SupportedPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/social/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          content,
          media,
          link,
          schedule: schedule || undefined,
          postId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to share content');
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          placeholder="What's on your mind?"
        />
      </div>

      {media.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Media</label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            {media.map((item, index) => (
              <div key={index} className="relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt=""
                    className="h-32 w-full object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={item.url}
                    poster={item.thumbnail}
                    className="h-32 w-full object-cover rounded-lg"
                    controls
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {link && (
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Link
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={e => setLink(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Share to Platforms
        </label>
        <div className="grid grid-cols-2 gap-4">
          {SUPPORTED_PLATFORMS.map(platform => (
            <button
              key={platform}
              type="button"
              onClick={() => handlePlatformToggle(platform)}
              className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                selectedPlatforms.includes(platform)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <span className="text-xl">{getPlatformIcon(platform)}</span>
              <span className="capitalize">{platform}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
          Schedule (optional)
        </label>
        <input
          type="datetime-local"
          id="schedule"
          value={schedule}
          onChange={e => setSchedule(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || selectedPlatforms.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sharing...' : 'Share'}
        </button>
      </div>
    </form>
  );
} 