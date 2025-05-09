import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';
import type { ApiError, PaginatedResponse, Notification } from '../../../types/api';

const NOTIFICATIONS_PER_PAGE = 20;

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const queryValidation = querySchema.safeParse(req.query);
        if (!queryValidation.success) {
          return res.status(400).json({ error: queryValidation.error.errors });
        }

        const { page } = queryValidation.data;
        const skip = (page - 1) * NOTIFICATIONS_PER_PAGE;

        const [notifications, total] = await Promise.all([
          prisma.notification.findMany({
            where: {
              userId: session.user.id,
            },
            include: {
              fromUser: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip,
            take: NOTIFICATIONS_PER_PAGE,
          }),
          prisma.notification.count({
            where: {
              userId: session.user.id,
            },
          }),
        ]);

        return res.status(200).json({
          notifications,
          hasMore: skip + notifications.length < total,
          total,
        });
      }

      case 'PUT': {
        const { action } = req.query;

        if (action === 'mark-all-read') {
          await prisma.notification.updateMany({
            where: {
              userId: session.user.id,
              read: false,
            },
            data: {
              read: true,
            },
          });

          return res.status(200).json({ message: 'All notifications marked as read' });
        }

        return res.status(400).json({ error: 'Invalid action' });
      }

      case 'DELETE': {
        const { action } = req.query;

        if (action === 'delete-all') {
          await prisma.notification.deleteMany({
            where: {
              userId: session.user.id,
            },
          });

          return res.status(200).json({ message: 'All notifications deleted' });
        }

        return res.status(400).json({ error: 'Invalid action' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notification operation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 