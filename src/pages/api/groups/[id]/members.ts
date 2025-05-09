import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';

const memberSchema = z.object({
  userId: z.string(),
  role: z.enum(['MEMBER', 'MODERATOR', 'ADMIN']).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const groupId = req.query.id as string;
  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required' });
  }

  try {
    // Check if user has permission to manage members
    const userMembership = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: session.user.id,
        role: { in: ['ADMIN', 'MODERATOR'] },
      },
    });

    if (!userMembership) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    switch (req.method) {
      case 'GET': {
        const members = await prisma.groupMember.findMany({
          where: { groupId },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        });
        return res.status(200).json(members);
      }

      case 'POST': {
        const validation = memberSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
        }

        const { userId, role = 'MEMBER' } = validation.data;

        // Check if user is already a member
        const existingMember = await prisma.groupMember.findFirst({
          where: {
            groupId,
            userId,
          },
        });

        if (existingMember) {
          return res.status(400).json({ error: 'User is already a member' });
        }

        const member = await prisma.groupMember.create({
          data: {
            groupId,
            userId,
            role,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        });

        // Create notification for new member
        await prisma.notification.create({
          data: {
            type: 'GROUP_INVITATION',
            content: `You were added to the group "${member.group.name}"`,
            userId,
          },
        });

        return res.status(201).json(member);
      }

      case 'PUT': {
        const validation = memberSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
        }

        const { userId, role } = validation.data;

        // Only admins can change roles
        if (userMembership.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Only admins can change roles' });
        }

        const member = await prisma.groupMember.update({
          where: {
            groupId_userId: {
              groupId,
              userId,
            },
          },
          data: { role },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        });

        // Create notification for role change
        await prisma.notification.create({
          data: {
            type: 'GROUP_ROLE_CHANGE',
            content: `Your role in "${member.group.name}" was changed to ${role}`,
            userId,
          },
        });

        return res.status(200).json(member);
      }

      case 'DELETE': {
        const { userId } = req.query;
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }

        // Can't remove the last admin
        if (userId === session.user.id) {
          const adminCount = await prisma.groupMember.count({
            where: {
              groupId,
              role: 'ADMIN',
            },
          });

          if (adminCount <= 1) {
            return res.status(400).json({ error: 'Cannot remove the last admin' });
          }
        }

        await prisma.groupMember.delete({
          where: {
            groupId_userId: {
              groupId,
              userId: userId as string,
            },
          },
        });

        // Create notification for member removal
        await prisma.notification.create({
          data: {
            type: 'GROUP_REMOVAL',
            content: `You were removed from the group`,
            userId: userId as string,
          },
        });

        return res.status(200).json({ message: 'Member removed successfully' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Group member operation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 