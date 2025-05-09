import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import type { ApiError } from '../../../../types/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const notificationId = req.query.id as string;
  if (!notificationId) {
    return res.status(400).json({ error: 'Notification ID is required' });
  }

  try {
    switch (req.method) {
      case 'POST': {
        // Check if notification exists and belongs to the user
        const notification = await prisma.notification.findFirst({
          where: {
            id: notificationId,
            userId: session.user.id,
          },
        });

        if (!notification) {
          return res.status(404).json({ error: 'Notification not found' });
        }

        // Update notification read status
        await prisma.notification.update({
          where: {
            id: notificationId,
          },
          data: {
            read: true,
          },
        });

        return res.status(200).json({ message: 'Notification marked as read' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notification read status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 