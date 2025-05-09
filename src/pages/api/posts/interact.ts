import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import prisma from '../../../lib/prisma';
import { logActivity } from '../../../utils/activity';

const interactionSchema = z.object({
  type: z.enum(['like', 'comment', 'repost']),
  postId: z.string(),
  content: z.string().optional(),
  parentCommentId: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validation = interactionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { type, postId, content, parentCommentId } = validation.data;
    const userId = session.user.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    let result;
    switch (type) {
      case 'like': {
        // Check if already liked
        const existingLike = await prisma.like.findFirst({
          where: {
            userId,
            postId
          }
        });

        if (existingLike) {
          // Unlike
          await prisma.like.delete({
            where: { id: existingLike.id }
          });
          result = { action: 'unliked' };
        } else {
          // Like
          result = await prisma.like.create({
            data: {
              userId,
              postId
            }
          });

          // Create notification for post author
          if (post.authorId !== userId) {
            await prisma.notification.create({
              data: {
                type: 'like',
                content: `${session.user.username} liked your post`,
                userId: post.authorId,
                postId,
                fromUserId: userId
              }
            });
          }
        }
        break;
      }

      case 'comment': {
        if (!content) {
          return res.status(400).json({ error: 'Comment content is required' });
        }

        result = await prisma.comment.create({
          data: {
            content,
            authorId: userId,
            postId,
            parentId: parentCommentId
          },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          }
        });

        // Create notification for post author
        if (post.authorId !== userId) {
          await prisma.notification.create({
            data: {
              type: 'comment',
              content: `${session.user.username} commented on your post`,
              userId: post.authorId,
              postId,
              fromUserId: userId
            }
          });
        }

        // Notify parent comment author if replying
        if (parentCommentId) {
          const parentComment = await prisma.comment.findUnique({
            where: { id: parentCommentId },
            select: { authorId: true }
          });

          if (parentComment && parentComment.authorId !== userId) {
            await prisma.notification.create({
              data: {
                type: 'reply',
                content: `${session.user.username} replied to your comment`,
                userId: parentComment.authorId,
                postId,
                fromUserId: userId
              }
            });
          }
        }
        break;
      }

      case 'repost': {
        // Check if already reposted
        const existingRepost = await prisma.repost.findFirst({
          where: {
            userId,
            postId
          }
        });

        if (existingRepost) {
          // Remove repost
          await prisma.repost.delete({
            where: { id: existingRepost.id }
          });
          result = { action: 'unreposted' };
        } else {
          // Create repost
          result = await prisma.repost.create({
            data: {
              userId,
              postId
            }
          });

          // Create notification for post author
          if (post.authorId !== userId) {
            await prisma.notification.create({
              data: {
                type: 'repost',
                content: `${session.user.username} reposted your post`,
                userId: post.authorId,
                postId,
                fromUserId: userId
              }
            });
          }
        }
        break;
      }
    }

    // Log activity
    await logActivity({
      userId,
      action: type,
      details: `Interacted with post ${postId}`,
      ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Post interaction error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 