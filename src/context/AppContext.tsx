import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useLocalStorage } from '../utils/hooks';

// Types
interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  friends: string[];
  settings: UserSettings;
  role: 'user' | 'admin' | 'superadmin';
  email: string;
  isVerified: boolean;
  createdAt: Date;
  lastLogin: Date;
  permissions: string[];
}

interface AdminSettings {
  canManageUsers: boolean;
  canManageContent: boolean;
  canManageSettings: boolean;
  canManageAdmins: boolean;
  canViewAnalytics: boolean;
  canManageRoles: boolean;
  canManageThemes: boolean;
  canManageEmoticons: boolean;
}

interface ThemeSettings {
  mode: 'light' | 'dark' | 'aero';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  customCSS: string;
  glassEffect: boolean;
  blurAmount: number;
  transparency: number;
  animations: boolean;
  shadows: boolean;
  gradients: boolean;
}

interface UserSettings {
  theme: ThemeSettings;
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
    showLastSeen: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    friendRequests: boolean;
    messages: boolean;
    mentions: boolean;
  };
  emoticons: {
    size: 'small' | 'medium' | 'large';
    allowCustomUploads: boolean;
    allowedTypes: ('gif' | 'png' | 'jpg' | 'jpeg')[];
  };
  admin?: AdminSettings;
}

interface Post {
  id: string;
  authorId: string;
  author: {
    id: string;
    displayName: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  shares: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  authorId: string;
  content: string;
  likes: string[];
  createdAt: Date;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  type: 'friend_request' | 'message' | 'mention' | 'like' | 'comment';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

interface AppState {
  currentUser: User | null | undefined;
  posts: Post[];
  messages: Message[];
  notifications: Notification[];
  onlineUsers: string[];
  loading: boolean;
  error: string | null;
  admins: User[];
  themes: Record<string, ThemeSettings>;
}

type Action =
  | { type: 'SET_USER'; payload: User | undefined }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: { id: string; updates: Partial<Post> } }
  | { type: 'DELETE_POST'; payload: string }
  | { type: 'ADD_COMMENT'; payload: { postId: string; comment: Comment } }
  | { type: 'DELETE_COMMENT'; payload: { postId: string; commentId: string } }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<Notification> } }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'SET_ONLINE_USERS'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<User['settings']> }
  | { type: 'CREATE_ADMIN'; payload: { user: User; adminSettings: AdminSettings } }
  | { type: 'UPDATE_ADMIN'; payload: { userId: string; adminSettings: Partial<AdminSettings> } }
  | { type: 'DELETE_ADMIN'; payload: string }
  | { type: 'UPDATE_THEME'; payload: { themeName: string; settings: Partial<ThemeSettings> } };

// Initial state
const initialState: AppState = {
  currentUser: null,
  posts: [],
  messages: [],
  notifications: [],
  onlineUsers: [],
  loading: false,
  error: null,
  admins: [],
  themes: {
    light: {
      mode: 'light',
      primaryColor: '#3B5998',
      secondaryColor: '#6B84B4',
      accentColor: '#4B4F56',
      font: 'Segoe UI',
      customCSS: '',
      glassEffect: false,
      blurAmount: 0,
      transparency: 1,
      animations: true,
      shadows: true,
      gradients: false,
    },
    dark: {
      mode: 'dark',
      primaryColor: '#1a1a1a',
      secondaryColor: '#2d2d2d',
      accentColor: '#3B5998',
      font: 'Segoe UI',
      customCSS: '',
      glassEffect: false,
      blurAmount: 0,
      transparency: 1,
      animations: true,
      shadows: true,
      gradients: false,
    },
    aero: {
      mode: 'aero',
      primaryColor: '#0078D7',
      secondaryColor: '#1E90FF',
      accentColor: '#00BFFF',
      font: 'Segoe UI',
      customCSS: '',
      glassEffect: true,
      blurAmount: 10,
      transparency: 0.8,
      animations: true,
      shadows: true,
      gradients: true,
    },
  },
};

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'UPDATE_USER':
      return {
        ...state,
        currentUser: state.currentUser ? { ...state.currentUser, ...action.payload } : null,
      };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? { ...post, ...action.payload.updates } : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId ? { ...post, comments: [...post.comments, action.payload.comment] } : post
        ),
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.postId ? { ...post, comments: post.comments.filter(c => c.id !== action.payload.commentId) } : post
        ),
      };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.id ? { ...message, ...action.payload.updates } : message
        ),
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(message => message.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id ? { ...notification, ...action.payload.updates } : notification
        ),
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        currentUser: state.currentUser ? {
          ...state.currentUser,
          settings: {
            ...state.currentUser.settings,
            ...action.payload,
          },
        } : null,
      };
    case 'CREATE_ADMIN':
      return {
        ...state,
        admins: [...state.admins, action.payload.user],
      };
    case 'UPDATE_ADMIN':
      return {
        ...state,
        admins: state.admins.map(admin =>
          admin.id === action.payload.userId ? { ...admin, ...action.payload.adminSettings } : admin
        ),
      };
    case 'DELETE_ADMIN':
      return {
        ...state,
        admins: state.admins.filter(admin => admin.id !== action.payload),
      };
    case 'UPDATE_THEME':
      return {
        ...state,
        themes: {
          ...state.themes,
          [action.payload.themeName]: {
            ...state.themes[action.payload.themeName],
            ...action.payload.settings,
          },
        },
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  markMessageAsRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  createAdmin: (userData: Partial<User>, adminSettings: AdminSettings) => void;
  updateAdmin: (userId: string, adminSettings: Partial<AdminSettings>) => void;
  deleteAdmin: (userId: string) => void;
  updateTheme: (themeName: string, settings: Partial<ThemeSettings>) => void;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [storedUser, setStoredUser] = useLocalStorage<User | null>('moodring_user', null);

  // Load user from localStorage on mount
  React.useEffect(() => {
    if (storedUser) {
      dispatch({ type: 'SET_USER', payload: storedUser });
    }
  }, [storedUser]);

  // Update user settings
  const updateUserSettings = useCallback((settings: Partial<UserSettings>) => {
    if (state.currentUser) {
      const updatedUser = {
        ...state.currentUser,
        settings: {
          ...state.currentUser.settings,
          ...settings,
        },
      };
      setStoredUser(updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }
  }, [state.currentUser, setStoredUser]);

  // Add post
  const addPost = useCallback((post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: Post = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_POST', payload: newPost });
  }, []);

  // Update post
  const updatePost = useCallback((id: string, updates: Partial<Post>) => {
    dispatch({ type: 'UPDATE_POST', payload: { id, updates } });
  }, []);

  // Delete post
  const deletePost = useCallback((id: string) => {
    dispatch({ type: 'DELETE_POST', payload: id });
  }, []);

  // Send message
  const sendMessage = useCallback((message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  }, []);

  // Mark message as read
  const markMessageAsRead = useCallback((id: string) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates: { read: true } } });
  }, []);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  }, []);

  // Create admin account
  const createAdmin = useCallback((userData: Partial<User>, adminSettings: AdminSettings) => {
    const newAdmin: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      role: 'admin',
      permissions: Object.entries(adminSettings)
        .filter(([_, value]) => value)
        .map(([key]) => key),
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: true,
    } as User;

    dispatch({ type: 'CREATE_ADMIN', payload: { user: newAdmin, adminSettings } });
  }, []);

  // Update admin settings
  const updateAdmin = useCallback((userId: string, adminSettings: Partial<AdminSettings>) => {
    dispatch({ type: 'UPDATE_ADMIN', payload: { userId, adminSettings } });
  }, []);

  // Delete admin
  const deleteAdmin = useCallback((userId: string) => {
    dispatch({ type: 'DELETE_ADMIN', payload: userId });
  }, []);

  // Update theme
  const updateTheme = useCallback((themeName: string, settings: Partial<ThemeSettings>) => {
    dispatch({ type: 'UPDATE_THEME', payload: { themeName, settings } });
  }, []);

  const value = {
    state,
    dispatch,
    updateUserSettings,
    addPost,
    updatePost,
    deletePost,
    sendMessage,
    markMessageAsRead,
    addNotification,
    removeNotification,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    updateTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 