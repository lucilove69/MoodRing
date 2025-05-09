import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';
import type { ApiError, Post, PaginatedResponse } from '../../../../types/api';

const POSTS_PER_PAGE = 10;

const postSchema = z.object({
  content: z.string().min(1).max(5000),
  mood: z.string().optional(),
  media: z.array(z.object({
    type: z.enum(['image', 'video', 'audio']),
    url: z.string().url(),
    thumbnail: z.string().url().optional(),
    duration: z.number().optional(),
  })).optional(),
  location: z.object({
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
  poll: z.object({
    question: z.string(),
    options: z.array(z.string()),
    duration: z.number(), // in hours
  }).optional(),
});

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  sort: z.enum(['newest', 'oldest', 'most_liked', 'most_commented']).default('newest'),
  filter: z.enum(['all', 'text', 'media', 'polls']).default('all'),
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
        const queryValidation = querySchema.safeParse(req.query);
        if (!queryValidation.success) {
          return res.status(400).json({ error: queryValidation.error.errors });
        }

        const { page, sort, filter } = queryValidation.data;
        const skip = (page - 1) * POSTS_PER_PAGE;

        // Build where clause based on filter
        const where = {
          groupId,
          ...(filter === 'text' && { media: { none: {} }, poll: null }),
          ...(filter === 'media' && { media: { some: {} } }),
          ...(filter === 'polls' && { poll: { not: null } }),
        };

        // Build orderBy clause based on sort
        const orderBy = {
          ...(sort === 'newest' && { createdAt: 'desc' }),
          ...(sort === 'oldest' && { createdAt: 'asc' }),
          ...(sort === 'most_liked' && { likes: { _count: 'desc' } }),
          ...(sort === 'most_commented' && { comments: { _count: 'desc' } }),
        };

        const [posts, total] = await Promise.all([
          prisma.post.findMany({
            where,
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
            orderBy,
            skip,
            take: POSTS_PER_PAGE,
          }),
          prisma.post.count({ where }),
        ]);

        return res.status(200).json({
          posts,
          hasMore: skip + posts.length < total,
          total,
        });
      }

      case 'POST': {
        const validation = postSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
        }

        const postData = validation.data;
        const post = await prisma.post.create({
          data: {
            ...postData,
            authorId: session.user.id,
            groupId,
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

        // Create notifications for group members
        const groupMembers = await prisma.groupMember.findMany({
          where: {
            groupId,
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
            type: 'GROUP_POST',
            content: `${session.user.username} posted in the group`,
            userId: member.userId,
            postId: post.id,
            fromUserId: session.user.id,
          })),
        });

        return res.status(201).json(post);
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Group post operation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 