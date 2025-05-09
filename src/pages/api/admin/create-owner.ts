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
    
    // Check if the requester is an admin
    if (!session?.user || session.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if an owner already exists
    const existingOwner = await prisma.user.findFirst({
      where: { role: 'owner' }
    });

    if (existingOwner) {
      return res.status(400).json({ message: 'Owner account already exists' });
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

    // Create owner account
    const owner = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        displayName,
        role: 'owner',
        isVerified: true,
        permissions: {
          // Core permissions
          canManageUsers: true,
          canManageContent: true,
          canManageAdmins: true,
          canManageThemes: true,
          canViewAnalytics: true,
          // Enhanced permissions
          canManageSystem: true,
          canManageRoles: true,
          canManageEmoticons: true,
          canManageBackups: true,
          canManageAPI: true,
          canManageSecurity: true,
          canManageOwnership: true,
          canAccessLogs: true,
          canManageIntegrations: true,
          // Owner-specific permissions
          isOwner: true,
          canTransferOwnership: true,
          canManageOwnerSettings: true
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
        action: 'CREATE_OWNER',
        details: `Created owner account for ${email}`,
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '',
        userAgent: req.headers['user-agent'] || ''
      }
    });

    return res.status(201).json({ message: 'Owner account created successfully' });
  } catch (error) {
    console.error('Error creating owner account:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 