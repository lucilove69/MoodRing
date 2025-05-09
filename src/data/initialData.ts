import { User, SystemSettings } from '../types';
import { hashPassword } from '../utils/auth';

// Default admin password: "admin123"
const ADMIN_PASSWORD_HASH = '$2a$10$7sY91G4Q/Bm5wIeaI.hjBeQYfETiOl4hunRc0dtTj.oyUat.mbXtK';

export const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'support@moodring.space',
    password: ADMIN_PASSWORD_HASH,
    displayName: 'MoodRing Admin',
    avatar: '/avatars/admin.png',
    role: 'admin',
    isVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    permissions: {
      // Core permissions
      canManageUsers: true,
      canManageContent: true,
      canManageAdmins: true,
      canManageThemes: true,
      canViewAnalytics: true,
      // Enhanced permissions
      canManageSystem: false,
      canManageRoles: false,
      canManageEmoticons: true,
      canManageBackups: false,
      canManageAPI: false,
      canManageSecurity: false,
      canManageOwnership: false,
      canAccessLogs: true,
      canManageIntegrations: false,
      // Owner-specific permissions
      isOwner: false,
      canTransferOwnership: false,
      canManageOwnerSettings: false
    },
    securitySettings: {
      twoFactorEnabled: true,
      lastPasswordChange: new Date().toISOString(),
      loginAttempts: 0,
      trustedDevices: [],
      ipWhitelist: []
    },
    friends: [],
    bio: 'Official MoodRing Administrator',
    location: 'MoodRing HQ',
    age: 25,
    gender: 'Other',
    orientation: 'Other',
    relationshipStatus: 'Single',
    interests: ['Admin', 'Support', 'Community Management'],
    favoriteMusic: ['System of a Down', 'Linkin Park', 'Evanescence'],
    favoriteMovies: ['The Matrix', 'Fight Club', 'Donnie Darko'],
    favoriteBooks: ['1984', 'Brave New World', 'Fahrenheit 451'],
    favoriteQuotes: ['"The only way to do great work is to love what you do." - Steve Jobs'],
    topFriends: [],
    profileViews: 0,
    deviceHistory: [],
    activityLog: []
  }
];

export const initialSystemSettings: SystemSettings = {
  siteName: 'MoodRing',
  siteDescription: 'A modern social media platform with a nostalgic touch',
  siteKeywords: ['social media', 'community', 'friends', 'networking', 'myspace', 'nostalgia'],
  contactEmail: 'contact@moodring.space',
  supportEmail: 'support@moodring.space',
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg'],
  maintenanceMode: false,
  registrationEnabled: true,
  requireEmailVerification: true,
  maxLoginAttempts: 5,
  lockoutDuration: 30 * 60, // 30 minutes
  sessionTimeout: 24 * 60 * 60, // 24 hours
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventReuse: 5,
    expiryDays: 90
  },
  backupSettings: {
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    includeUploads: true,
    backupEncryption: true
  },
  analytics: {
    enabled: true,
    trackPageViews: true,
    trackEvents: true,
    trackErrors: true,
    anonymizeIPs: true
  }
}; 