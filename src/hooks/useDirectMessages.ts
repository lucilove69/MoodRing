import { useState, useEffect, useCallback } from 'react';
import { DirectMessage, Friend, FriendRequest } from '../types/api';
import { WebSocketService } from '../services/api';
import { Emoticon } from '../constants/emoticons';

export const useDirectMessages = (userId: string) => {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsService, setWsService] = useState<WebSocketService | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocketService(userId);
    ws.connect();
    setWsService(ws);

    // Load initial data
    loadMessages();
    loadFriends();
    loadFriendRequests();

    // Subscribe to WebSocket events
    ws.subscribeToStatusUpdates((data: any) => {
      if (data.type === 'typing') {
        handleTypingUpdate(data);
      } else if (data.type === 'message') {
        handleNewMessage(data);
      }
    });

    return () => {
      ws.disconnect();
    };
  }, [userId]);

  const loadMessages = async (friendId?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/messages${friendId ? `?friendId=${friendId}` : ''}`);
      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      const data = await response.json();
      setFriends(data.friends);
    } catch (err) {
      console.error('Failed to load friends:', err);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const response = await fetch('/api/friends/requests');
      const data = await response.json();
      setFriendRequests(data.requests);
    } catch (err) {
      console.error('Failed to load friend requests:', err);
    }
  };

  const sendMessage = async (
    receiverId: string,
    content: string,
    emoticons?: Emoticon[],
    customEmoticons?: Emoticon[]
  ) => {
    try {
      setError(null);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId,
          content,
          emoticons: emoticons?.map(e => e.id),
          customEmoticons: customEmoticons?.map(e => e.id),
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
      return data.message;
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
      throw err;
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId }),
      });

      const data = await response.json();
      setFriendRequests(prev => [...prev, data.request]);
      return data.request;
    } catch (err) {
      console.error('Failed to send friend request:', err);
      throw err;
    }
  };

  const handleFriendRequest = async (requestId: string, accept: boolean) => {
    try {
      const response = await fetch(`/api/friends/request/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accept }),
      });

      const data = await response.json();
      if (accept) {
        setFriends(prev => [...prev, data.friend]);
      }
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
      return data;
    } catch (err) {
      console.error('Failed to handle friend request:', err);
      throw err;
    }
  };

  const handleTypingUpdate = (data: any) => {
    if (data.isTyping) {
      setTypingUsers(prev => new Set([...Array.from(prev), data.userId]));
    } else {
      setTypingUsers(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(data.userId);
        return newSet;
      });
    }
  };

  const handleNewMessage = (data: any) => {
    setMessages(prev => [...prev, data.message]);
  };

  const sendTypingStatus = (friendId: string, isTyping: boolean) => {
    if (wsService) {
      wsService.send({
        type: 'typing',
        data: {
          userId,
          friendId,
          isTyping,
        },
      });
    }
  };

  return {
    messages,
    friends,
    friendRequests,
    isLoading,
    error,
    typingUsers,
    sendMessage,
    sendFriendRequest,
    handleFriendRequest,
    sendTypingStatus,
    refreshMessages: loadMessages,
    refreshFriends: loadFriends,
    refreshFriendRequests: loadFriendRequests,
  };
}; 