import React, { useState, useEffect } from 'react';
import { Bell, X, UserPlus, MessageSquare, AtSign, Heart, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../utils/hooks';

const NotificationCenter: React.FC = () => {
  const { state, removeNotification } = useApp();
  const { permission, requestPermission, sendNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Request notification permission on mount
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    // Update unread count
    const count = state.notifications.filter(n => !n.read).length;
    setUnreadCount(count);

    // Send browser notification for new notifications
    if (permission === 'granted' && count > 0) {
      const latestNotification = state.notifications[0];
      if (latestNotification && !latestNotification.read) {
        sendNotification(latestNotification.title, {
          body: latestNotification.message,
          icon: '/favicon.ico',
        });
      }
    }
  }, [state.notifications, permission, sendNotification]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <UserPlus className="w-5 h-5 text-blue-400" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-green-400" />;
      case 'mention':
        return <AtSign className="w-5 h-5 text-purple-400" />;
      case 'like':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200"
        data-tooltip="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {state.notifications.length === 0 ? (
              <div className="p-4 text-center text-white/70">
                No notifications
              </div>
            ) : (
              state.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-white/5 transition-colors duration-200 ${
                    !notification.read ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{notification.title}</p>
                      <p className="text-white/70 text-sm mt-1">{notification.message}</p>
                      <p className="text-white/50 text-xs mt-2">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="flex-shrink-0 text-white/50 hover:text-white/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 