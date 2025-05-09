import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    // Verify ownership
    const scheduledContent = await prisma.scheduledContent.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!scheduledContent) {
      return res.status(404).json({ error: 'Scheduled content not found' });
    }

    if (scheduledContent.userId !== session.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    switch (req.method) {
      case 'GET': {
        const content = await prisma.scheduledContent.findUnique({
          where: { id },
        });

        return res.status(200).json(content);
      }

      case 'PUT': {
        const { content, platforms, scheduledFor, status } = req.body;

        const updatedContent = await prisma.scheduledContent.update({
          where: { id },
          data: {
            content,
            platforms,
            scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
            status,
          },
        });

        return res.status(200).json(updatedContent);
      }

      case 'DELETE': {
        await prisma.scheduledContent.delete({
          where: { id },
        });

        return res.status(204).end();
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Scheduled content error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 