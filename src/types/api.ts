import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { UserSettings } from './userSettings';
import { UserStatus } from '../constants/status';
import { Emoticon } from '../constants/emoticons';

export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

export interface AuthenticatedRequest extends NextApiRequest {
  session: Session;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  total: number;
}

export interface Notification {
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

export interface Post {
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

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  isPrivate: boolean;
  createdAt: string;
  members: Array<{
    id: string;
    role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
    user: {
      id: string;
      username: string;
      avatar?: string;
    };
  }>;
  _count: {
    members: number;
    posts: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// User Settings Types
export interface GetSettingsResponse extends ApiResponse<UserSettings> {}
export interface UpdateSettingsRequest {
  settings: Partial<UserSettings>;
}
export interface UpdateSettingsResponse extends ApiResponse<UserSettings> {}

// Status Types
export interface GetStatusResponse extends ApiResponse<{
  status: UserStatus;
  message?: string;
  lastSeen?: Date;
}> {}

export interface UpdateStatusRequest {
  status: UserStatus;
  message?: string;
}

// Emoticon Types
export interface GetEmoticonsResponse extends ApiResponse<Emoticon[]> {}

export interface UploadEmoticonRequest {
  file: File;
  name: string;
  category?: string;
  isCustom?: boolean;
  userId?: string;
}

export interface UploadEmoticonResponse extends ApiResponse<Emoticon> {}

// WebSocket Types
export interface WebSocketMessage {
  type: 'status_update' | 'typing' | 'message' | 'presence';
  data: any;
  timestamp: number;
}

export interface StatusUpdateMessage extends WebSocketMessage {
  type: 'status_update';
  data: {
    userId: string;
    status: UserStatus;
    message?: string;
  };
}

export interface TypingMessage extends WebSocketMessage {
  type: 'typing';
  data: {
    userId: string;
    chatId: string;
    isTyping: boolean;
  };
}

export interface PresenceMessage extends WebSocketMessage {
  type: 'presence';
  data: {
    userId: string;
    isOnline: boolean;
    lastSeen?: Date;
  };
}

// Direct Message Types
export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  emoticons?: Emoticon[];
  customEmoticons?: Emoticon[];
  timestamp: Date;
  isRead: boolean;
}

export interface GetMessagesResponse extends ApiResponse<DirectMessage[]> {}

export interface SendMessageRequest {
  content: string;
  emoticons?: string[];
  customEmoticons?: string[];
}

export interface SendMessageResponse extends ApiResponse<DirectMessage> {}

// Friend Types
export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  timestamp: Date;
}

export interface GetFriendsResponse extends ApiResponse<Friend[]> {}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
}

export interface GetFriendRequestsResponse extends ApiResponse<FriendRequest[]> {} 