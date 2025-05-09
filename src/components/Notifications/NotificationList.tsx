import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'GROUP_POST' | 'POST_LIKE' | 'POST_COMMENT' | 'COMMENT_REPLY' | 'SHARED_POST';
  content: string;
  createdAt: string;
  read: boolean;
  postId?: string;
  fromUser?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export default function NotificationList() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (pageNum: number) => {
    try {
      const response = await fetch(`/api/notifications?page=${pageNum}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(pageNum === 1 ? data.notifications : [...notifications, ...data.notifications]);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchNotifications(1);
    }
  }, [session]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark notification as read');
      
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'GROUP_POST':
        return '📝';
      case 'POST_LIKE':
        return '❤️';
      case 'POST_COMMENT':
      case 'COMMENT_REPLY':
        return '💬';
      case 'SHARED_POST':
        return '↗️';
      default:
        return '📢';
    }
  };

  if (loading && page === 1) {
    return <div className="p-4">Loading notifications...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notifications yet
        </div>
      ) : (
        <>
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.postId ? `/posts/${notification.postId}` : '#'}
              className={`block p-4 rounded-lg transition-colors ${
                notification.read ? 'bg-white' : 'bg-blue-50'
              } hover:bg-gray-50`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{notification.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    {notification.fromUser && (
                      <div className="flex items-center space-x-2">
                        {notification.fromUser.avatar ? (
                          <img
                            src={notification.fromUser.avatar}
                            alt={notification.fromUser.username}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">
                            {notification.fromUser.username[0]}
                          </div>
                        )}
                        <span className="text-sm text-gray-500">
                          {notification.fromUser.username}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt))} ago
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

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
        </>
      )}
    </div>
  );
} 