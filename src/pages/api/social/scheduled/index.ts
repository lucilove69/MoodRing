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

  try {
    switch (req.method) {
      case 'GET': {
        const scheduledContent = await prisma.scheduledContent.findMany({
          where: {
            userId: session.user.id,
            status: 'pending',
          },
          orderBy: {
            scheduledFor: 'asc',
          },
        });

        return res.status(200).json(scheduledContent);
      }

      case 'POST': {
        const { content, platforms, scheduledFor } = req.body;

        const scheduledContent = await prisma.scheduledContent.create({
          data: {
            userId: session.user.id,
            content,
            platforms,
            scheduledFor: new Date(scheduledFor),
          },
        });

        return res.status(201).json(scheduledContent);
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Scheduled content error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 