import { prisma } from '../lib/prisma';

interface ActivityLogParams {
  userId: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity({
  userId,
  action,
  details,
  ipAddress,
  userAgent
}: ActivityLogParams) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
        userAgent
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw the error to prevent disrupting the main flow
  }
}

export async function getUserActivity(userId: string, limit = 50) {
  try {
    return await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  } catch (error) {
    console.error('Failed to fetch user activity:', error);
    throw error;
  }
}

export async function getRecentActivity(limit = 20) {
  try {
    return await prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch recent activity:', error);
    throw error;
  }
} 