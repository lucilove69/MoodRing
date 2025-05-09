import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../../utils/auth';
import { prisma } from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    
    // Check if the requester is an admin or owner
    if (!session?.user || !['admin', 'owner'].includes(session.user.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { email, username, password, displayName } = req.body;

    // Validate required fields
    if (!email || !username || !password || !displayName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
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

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin account
    const admin = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        displayName,
        role: 'admin',
        isVerified: true,
        permissions: {
          // Core permissions
          canManageUsers: true,
          canManageContent: true,
          canManageAdmins: false, // Can't manage other admins
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
        }
      }
    });

    // Log the creation
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_ADMIN',
        details: `Created admin account for ${email}`,
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '',
        userAgent: req.headers['user-agent'] || ''
      }
    });

    return res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Error creating admin account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 