import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';
import type { ApiError, Post } from '../../../../types/api';

const shareSchema = z.object({
  targetGroupId: z.string().optional(),
  targetUserId: z.string().optional(),
  message: z.string().max(500).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const postId = req.query.id as string;
  if (!postId) {
    return res.status(400).json({ error: 'Post ID is required' });
  }

  try {
    // Check if post exists and user has access
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        group: {
          include: {
            members: {
              where: {
                userId: session.user.id,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // If post is in a group, check if user is a member
    if (post.groupId && post.group.members.length === 0) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    switch (req.method) {
      case 'POST': {
        const validation = shareSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
        }

        const { targetGroupId, targetUserId, message } = validation.data;

        // Validate that at least one target is specified
        if (!targetGroupId && !targetUserId) {
          return res.status(400).json({ error: 'Either targetGroupId or targetUserId must be specified' });
        }

        // Create a shared post
        const sharedPost = await prisma.post.create({
          data: {
            content: message || `Shared by ${session.user.username}`,
            authorId: session.user.id,
            groupId: targetGroupId,
            sharedFromId: postId,
            media: post.media,
            mood: post.mood,
            location: post.location,
            tags: post.tags,
            mentions: post.mentions,
            poll: post.poll,
          },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        });

        // Create notifications
        if (targetGroupId) {
          // Notify group members
          const groupMembers = await prisma.groupMember.findMany({
            where: {
              groupId: targetGroupId,
              userId: {
                not: session.user.id,
              },
            },
            select: {
              userId: true,
            },
          });

          await prisma.notification.createMany({
            data: groupMembers.map(member => ({
              type: 'SHARED_POST',
              content: `${session.user.username} shared a post in the group`,
              userId: member.userId,
              postId: sharedPost.id,
              fromUserId: session.user.id,
            })),
          });
        } else if (targetUserId) {
          // Notify target user
          await prisma.notification.create({
            data: {
              type: 'SHARED_POST',
              content: `${session.user.username} shared a post with you`,
              userId: targetUserId,
              postId: sharedPost.id,
              fromUserId: session.user.id,
            },
          });
        }

        return res.status(201).json(sharedPost);
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Post share error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 