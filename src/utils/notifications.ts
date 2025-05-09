import { prisma } from '../lib/prisma';

interface CreateNotificationParams {
  type: string;
  content: string;
  userId: string;
  postId?: string;
  fromUserId?: string;
}

export async function createNotification({
  type,
  content,
  userId,
  postId,
  fromUserId
}: CreateNotificationParams) {
  try {
    return await prisma.notification.create({
      data: {
        type,
        content,
        userId,
        postId,
        fromUserId
      }
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

export async function getUserNotifications(userId: string, limit = 20) {
  try {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        post: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch user notifications:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw error;
  }
}

export async function getUnreadNotificationCount(userId: string) {
  try {
    return await prisma.notification.count({
      where: { userId, read: false }
    });
  } catch (error) {
    console.error('Failed to get unread notification count:', error);
    throw error;
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    await prisma.notification.delete({
      where: { id: notificationId }
    });
  } catch (error) {
    console.error('Failed to delete notification:', error);
    throw error;
  }
}

export async function deleteAllNotifications(userId: string) {
  try {
    await prisma.notification.deleteMany({
      where: { userId }
    });
  } catch (error) {
    console.error('Failed to delete all notifications:', error);
    throw error;
  }
} 