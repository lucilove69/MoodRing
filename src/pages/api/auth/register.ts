import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { hashPassword, validateUserData, generateVerificationCode } from '../../../utils/auth';
import { sendVerificationEmail } from '../../../utils/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, username, password, displayName } = req.body;

    // Validate required fields
    if (!email || !username || !password || !displayName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate user data
    const validation = validateUserData({ email, username, password });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // Check if email or username is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already taken' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // 24 hour expiry

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user account
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        displayName,
        role: 'user',
        isVerified: false,
        verificationCode,
        verificationExpiry,
        permissions: {
          // Core permissions
          canManageUsers: false,
          canManageContent: false,
          canManageAdmins: false,
          canManageThemes: false,
          canViewAnalytics: false,
          // Enhanced permissions
          canManageSystem: false,
          canManageRoles: false,
          canManageEmoticons: false,
          canManageBackups: false,
          canManageAPI: false,
          canManageSecurity: false,
          canManageOwnership: false,
          canAccessLogs: false,
          canManageIntegrations: false,
          // Owner-specific permissions
          isOwner: false,
          canTransferOwnership: false,
          canManageOwnerSettings: false
        },
        securitySettings: {
          twoFactorEnabled: false,
          lastPasswordChange: new Date().toISOString(),
          loginAttempts: 0,
          trustedDevices: [],
          ipWhitelist: []
        }
      }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // Log the registration
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        details: 'User registered',
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '',
        userAgent: req.headers['user-agent'] || ''
      }
    });

    return res.status(201).json({ 
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user.id
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 