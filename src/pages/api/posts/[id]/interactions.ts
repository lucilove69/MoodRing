import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';
import type { ApiError, Post } from '../../../../types/api';

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: z.string().optional(),
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
        const { action } = req.query;
        
        switch (action) {
          case 'like': {
            // Check if already liked
            const existingLike = await prisma.like.findUnique({
              where: {
                postId_userId: {
                  postId,
                  userId: session.user.id,
                },
              },
            });

            if (existingLike) {
              // Unlike
              await prisma.like.delete({
                where: {
                  postId_userId: {
                    postId,
                    userId: session.user.id,
                  },
                },
              });
            } else {
              // Like
              await prisma.like.create({
                data: {
                  postId,
                  userId: session.user.id,
                },
              });

              // Create notification for post author
              if (post.authorId !== session.user.id) {
                await prisma.notification.create({
                  data: {
                    type: 'POST_LIKE',
                    content: `${session.user.username} liked your post`,
                    userId: post.authorId,
                    postId,
                    fromUserId: session.user.id,
                  },
                });
              }
            }

            // Get updated like count
            const updatedPost = await prisma.post.findUnique({
              where: { id: postId },
              include: {
                _count: {
                  select: {
                    likes: true,
                    comments: true,
                  },
                },
              },
            });

            return res.status(200).json(updatedPost);
          }

          case 'comment': {
            const validation = commentSchema.safeParse(req.body);
            if (!validation.success) {
              return res.status(400).json({ error: validation.error.errors });
            }

            const { content, parentId } = validation.data;

            // If it's a reply, check if parent comment exists
            if (parentId) {
              const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
              });

              if (!parentComment) {
                return res.status(404).json({ error: 'Parent comment not found' });
              }
            }

            const comment = await prisma.comment.create({
              data: {
                content,
                postId,
                authorId: session.user.id,
                parentId,
              },
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            });

            // Create notification for post author
            if (post.authorId !== session.user.id) {
              await prisma.notification.create({
                data: {
                  type: 'POST_COMMENT',
                  content: `${session.user.username} commented on your post`,
                  userId: post.authorId,
                  postId,
                  fromUserId: session.user.id,
                },
              });
            }

            // If it's a reply, notify the parent comment author
            if (parentId) {
              const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
                select: { authorId: true },
              });

              if (parentComment && parentComment.authorId !== session.user.id) {
                await prisma.notification.create({
                  data: {
                    type: 'COMMENT_REPLY',
                    content: `${session.user.username} replied to your comment`,
                    userId: parentComment.authorId,
                    postId,
                    fromUserId: session.user.id,
                  },
                });
              }
            }

            return res.status(201).json(comment);
          }

          default:
            return res.status(400).json({ error: 'Invalid action' });
        }
      }

      case 'GET': {
        const { type } = req.query;
        
        switch (type) {
          case 'comments': {
            const comments = await prisma.comment.findMany({
              where: {
                postId,
                parentId: null, // Only get top-level comments
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
                    replies: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            });

            return res.status(200).json(comments);
          }

          case 'replies': {
            const { commentId } = req.query;
            if (!commentId) {
              return res.status(400).json({ error: 'Comment ID is required' });
            }

            const replies = await prisma.comment.findMany({
              where: {
                postId,
                parentId: commentId as string,
              },
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            });

            return res.status(200).json(replies);
          }

          default:
            return res.status(400).json({ error: 'Invalid type' });
        }
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Post interaction error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 