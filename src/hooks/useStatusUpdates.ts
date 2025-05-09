import { useState, useEffect, useCallback } from 'react';
import { WebSocketService, statusApi, ApiError } from '../services/api';
import { UserStatus } from '../constants/status';

interface StatusUpdate {
  userId: string;
  status: UserStatus;
  message?: string;
  timestamp: number;
}

export const useStatusUpdates = (userId: string) => {
  const [status, setStatus] = useState<UserStatus>('offline');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsService, setWsService] = useState<WebSocketService | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocketService(userId);
    ws.connect();
    setWsService(ws);

    // Load initial status
    loadStatus();

    // Subscribe to status updates
    ws.subscribeToStatusUpdates((data: StatusUpdate) => {
      if (data.userId === userId) {
        setStatus(data.status);
        setStatusMessage(data.message || '');
      }
    });

    return () => {
      ws.disconnect();
    };
  }, [userId]);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await statusApi.getStatus(userId);
      setStatus(data.status as UserStatus);
      setStatusMessage(data.message || '');
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to load status');
      console.error('Error loading status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: UserStatus, message?: string) => {
    try {
      setError(null);
      await statusApi.updateStatus(userId, newStatus, message);
      setStatus(newStatus);
      setStatusMessage(message || '');
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Failed to update status');
      console.error('Error updating status:', error);
      throw error;
    }
  };

  const refreshStatus = useCallback(() => {
    loadStatus();
  }, []);

  return {
    status,
    statusMessage,
    isLoading,
    error,
    updateStatus,
    refreshStatus
  };
}; 