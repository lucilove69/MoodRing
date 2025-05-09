import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SUPPORTED_PLATFORMS, type SupportedPlatform } from '../../config/integrations';

interface Connection {
  platform: SupportedPlatform;
  platformId: string;
  platformData: any;
  createdAt: string;
}

export default function SocialConnections() {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchConnections();
    }
  }, [session]);

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/social/connections');
      if (!response.ok) throw new Error('Failed to fetch connections');
      const data = await response.json();
      setConnections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: SupportedPlatform) => {
    // Generate OAuth URL and redirect
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      platform,
      state,
      redirect_uri: `${window.location.origin}/api/social/${platform}/callback`,
    });

    window.location.href = `/api/social/${platform}/auth?${params.toString()}`;
  };

  const handleDisconnect = async (platform: SupportedPlatform) => {
    try {
      const response = await fetch(`/api/social/${platform}/connect`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to disconnect');

      setConnections(connections.filter(conn => conn.platform !== platform));
    } catch (err) {
      console.error('Error disconnecting:', err);
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

  if (loading) {
    return <div className="p-4">Loading social connections...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Connected Platforms</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPORTED_PLATFORMS.map(platform => {
          const connection = connections.find(conn => conn.platform === platform);

          return (
            <div
              key={platform}
              className="p-6 rounded-lg border transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPlatformIcon(platform)}</span>
                  <div>
                    <h3 className="text-lg font-semibold capitalize">
                      {platform}
                    </h3>
                    {connection && (
                      <p className="text-sm text-gray-500">
                        Connected {new Date(connection.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {connection ? (
                  <button
                    onClick={() => handleDisconnect(platform)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(platform)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>

              {connection && connection.platformData && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>Platform ID: {connection.platformId}</p>
                  {/* Add more platform-specific info here */}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">About Social Connections</h3>
        <p className="text-gray-600">
          Connect your social media accounts to share content across platforms.
          Your connections are secure and can be removed at any time.
        </p>
      </div>
    </div>
  );
} 