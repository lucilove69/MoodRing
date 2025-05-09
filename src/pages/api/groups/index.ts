import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

const groupSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  isPrivate: z.boolean().optional(),
  rules: z.array(z.string()).optional(),
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
        const groups = await prisma.group.findMany({
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
            _count: {
              select: {
                members: true,
                posts: true,
              },
            },
          },
        });
        return res.status(200).json(groups);
      }

      case 'POST': {
        const validation = groupSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
        }

        const groupData = validation.data;
        const group = await prisma.group.create({
          data: {
            ...groupData,
            members: {
              create: {
                userId: session.user.id,
                role: 'ADMIN',
              },
            },
          },
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });

        // Create notification for group creation
        await prisma.notification.create({
          data: {
            type: 'GROUP_CREATED',
            content: `You created the group "${group.name}"`,
            userId: session.user.id,
          },
        });

        return res.status(201).json(group);
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Group operation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 