import axios from 'axios';
import { UserSettings } from '../types/userSettings';
import { Emoticon } from '../constants/emoticons';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Settings API
export const userSettingsApi = {
  getSettings: async (userId: string): Promise<UserSettings> => {
    const response = await api.get(`/users/${userId}/settings`);
    return response.data;
  },

  updateSettings: async (userId: string, settings: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await api.patch(`/users/${userId}/settings`, settings);
    return response.data;
  },

  resetSettings: async (userId: string): Promise<UserSettings> => {
    const response = await api.post(`/users/${userId}/settings/reset`);
    return response.data;
  },
};

// Status API
export const statusApi = {
  updateStatus: async (userId: string, status: string, message?: string): Promise<void> => {
    await api.post(`/users/${userId}/status`, { status, message });
  },

  getStatus: async (userId: string): Promise<{ status: string; message?: string }> => {
    const response = await api.get(`/users/${userId}/status`);
    return response.data;
  },
};

// Emoticon API
export const emoticonApi = {
  getEmoticons: async (): Promise<Emoticon[]> => {
    const response = await api.get('/emoticons');
    return response.data;
  },

  uploadEmoticon: async (file: File, name: string): Promise<Emoticon> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const response = await api.post('/emoticons/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteEmoticon: async (emoticonId: string): Promise<void> => {
    await api.delete(`/emoticons/${emoticonId}`);
  },
};

// WebSocket Service
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  constructor(private userId: string) {}

  connect() {
    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:3001'}/ws?userId=${this.userId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  subscribeToStatusUpdates(callback: (data: any) => void) {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'status_update') {
          callback(data);
        }
      };
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new ApiError(
        error.response.status,
        error.response.data.message || 'An error occurred',
        error.response.data
      );
    }
    throw new ApiError(500, 'Network error');
  }
);