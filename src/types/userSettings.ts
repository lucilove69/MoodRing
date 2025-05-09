import { UserStatus } from '../constants/status';

export interface EmoticonPreferences {
  size: 'small' | 'medium' | 'large';
  showPreview: boolean;
  autoConvert: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sound: boolean;
  statusUpdates: boolean;
  friendRequests: boolean;
  messages: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  allowFriendRequests: boolean;
  allowMessages: boolean;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

export interface UserSettings {
  id: string;
  userId: string;
  status: UserStatus;
  statusMessage?: string;
  emoticons: EmoticonPreferences;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  theme: ThemeSettings;
  lastUpdated: Date;
}

export const DEFAULT_EMOTICON_PREFERENCES: EmoticonPreferences = {
  size: 'medium',
  showPreview: true,
  autoConvert: true
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email: true,
  push: true,
  sound: true,
  statusUpdates: true,
  friendRequests: true,
  messages: true
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profileVisibility: 'public',
  showOnlineStatus: true,
  showLastSeen: true,
  allowFriendRequests: true,
  allowMessages: true
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  mode: 'system',
  primaryColor: '#7FB3D5',
  fontSize: 'medium',
  compactMode: false
};

// WebSocket Events
status_update: { userId: string, status: string, message?: string }
typing: { userId: string, chatId: string, isTyping: boolean }
message: { message: DirectMessage }
presence: { userId: string, isOnline: boolean, lastSeen?: Date }

// File Storage Configuration
const storageConfig = {
  maxFileSize: process.env.REACT_APP_MAX_FILE_SIZE,
  allowedTypes: process.env.REACT_APP_ALLOWED_FILE_TYPES.split(','),
  storagePath: process.env.REACT_APP_EMOTICON_STORAGE_PATH,
};

// Example usage
<DirectMessageChat
  userId="user123"
  friendId="friend456"
  friendName="John Doe"
/> 