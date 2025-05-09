export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  role: 'user' | 'admin' | 'owner';
  isVerified: boolean;
  createdAt: string;
  lastLogin: string;
  permissions: {
    // Core permissions
    canManageUsers: boolean;
    canManageContent: boolean;
    canManageAdmins: boolean;
    canManageThemes: boolean;
    canViewAnalytics: boolean;
    // Enhanced permissions
    canManageSystem: boolean;
    canManageRoles: boolean;
    canManageEmoticons: boolean;
    canManageBackups: boolean;
    canManageAPI: boolean;
    canManageSecurity: boolean;
    canManageOwnership: boolean;
    canAccessLogs: boolean;
    canManageIntegrations: boolean;
    // Owner-specific permissions
    isOwner: boolean;
    canTransferOwnership: boolean;
    canManageOwnerSettings: boolean;
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginAttempts: number;
    lockedUntil?: string;
    trustedDevices: string[];
    ipWhitelist: string[];
  };
  friends: string[];
  bio?: string;
  location?: string;
  age?: number;
  gender?: string;
  orientation?: string;
  relationshipStatus?: string;
  interests: string[];
  favoriteMusic: string[];
  favoriteMovies: string[];
  favoriteBooks: string[];
  favoriteQuotes: string[];
  topFriends: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  status?: string;
  mood?: string;
  customCSS?: string;
  customHTML?: string;
  profileSong?: string;
  profileViews: number;
  // Enhanced user features
  verificationCode?: string;
  verificationExpiry?: string;
  recoveryEmail?: string;
  backupCodes?: string[];
  lastActivity?: string;
  deviceHistory: Array<{
    deviceId: string;
    deviceName: string;
    ipAddress: string;
    lastLogin: string;
    location?: string;
  }>;
  activityLog: Array<{
    action: string;
    timestamp: string;
    ipAddress: string;
    deviceId: string;
    details?: string;
  }>;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
  userId: string;
}

export interface Comment {
  id: string;
  userId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Bulletin {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface Theme {
  id: string;
  name: string;
  css: string;
  thumbnail: string;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'aero' | 'custom';
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
  // Enhanced theme settings
  customFonts: string[];
  backgroundImage?: string;
  backgroundBlur: number;
  backgroundOverlay: string;
  borderRadius: number;
  buttonStyle: 'flat' | 'gradient' | 'glass' | 'classic';
  iconSet: 'modern' | 'classic' | 'aero' | 'custom';
  layoutType: 'classic' | 'modern' | 'compact';
  animationSpeed: 'slow' | 'normal' | 'fast';
  customAnimations: Record<string, string>;
  colorScheme: {
    background: string;
    foreground: string;
    border: string;
    text: string;
    textSecondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteKeywords: string[];
  contactEmail: string;
  supportEmail: string;
  maxUploadSize: number;
  allowedFileTypes: string[];
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  requireEmailVerification: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventReuse: number;
    expiryDays: number;
  };
  backupSettings: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupRetention: number;
    includeUploads: boolean;
    backupEncryption: boolean;
  };
  analytics: {
    enabled: boolean;
    trackPageViews: boolean;
    trackEvents: boolean;
    trackErrors: boolean;
    anonymizeIPs: boolean;
  };
}