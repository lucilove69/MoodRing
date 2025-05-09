import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';

const updateGroupSchema = z.object({
  name: z.string().min(3).max(50).optional(),
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

  const groupId = req.query.id as string;
  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required' });
  }

  try {
    // Check if user is a member of the group
    const membership = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: session.user.id,
      },
    });

    if (!membership) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    switch (req.method) {
      case 'GET': {
        const group = await prisma.group.findUnique({
          where: { id: groupId },
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

        if (!group) {
          return res.status(404).json({ error: 'Group not found' });
        }

        return res.status(200).json(group);
      }

      case 'PUT': {
        // Only admins can update group details
        if (membership.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Only admins can update group details' });
        }

        const validation = updateGroupSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
        }

        const groupData = validation.data;
        const updatedGroup = await prisma.group.update({
          where: { id: groupId },
          data: groupData,
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

        // Create notification for group update
        await prisma.notification.createMany({
          data: updatedGroup.members
            .filter(member => member.userId !== session.user.id)
            .map(member => ({
              type: 'GROUP_UPDATED',
              content: `The group "${updatedGroup.name}" was updated`,
              userId: member.userId,
            })),
        });

        return res.status(200).json(updatedGroup);
      }

      case 'DELETE': {
        // Only admins can delete groups
        if (membership.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Only admins can delete groups' });
        }

        // Check if there are other admins
        const adminCount = await prisma.groupMember.count({
          where: {
            groupId,
            role: 'ADMIN',
          },
        });

        if (adminCount > 1) {
          return res.status(400).json({
            error: 'Cannot delete group while other admins exist. Transfer ownership first.',
          });
        }

        // Delete the group
        await prisma.group.delete({
          where: { id: groupId },
        });

        // Create notifications for all members
        await prisma.notification.createMany({
          data: membership.map(member => ({
            type: 'GROUP_DELETED',
            content: `The group "${membership.group.name}" was deleted`,
            userId: member.userId,
          })),
        });

        return res.status(200).json({ message: 'Group deleted successfully' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Group operation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 