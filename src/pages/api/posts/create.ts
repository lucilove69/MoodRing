import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { env } from '../../../config/env';
import { z } from 'zod';

const postSchema = z.object({
  content: z.string().min(1).max(5000),
  mood: z.string().optional(),
  visibility: z.enum(['public', 'friends', 'private']),
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate post data
    const validation = postSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Invalid post data',
        errors: validation.error.errors 
      });
    }

    const postData = validation.data;

    // Create post
    const post = await prisma.post.create({
      data: {
        content: postData.content,
        mood: postData.mood,
        visibility: postData.visibility,
        authorId: session.user.id,
        media: postData.media || [],
        location: postData.location,
        tags: postData.tags || [],
        mentions: postData.mentions || [],
        poll: postData.poll ? {
          create: {
            question: postData.poll.question,
            options: postData.poll.options,
            endTime: new Date(Date.now() + postData.poll.duration * 60 * 60 * 1000),
          }
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          }
        },
        poll: true,
      }
    });

    // Notify mentioned users
    if (postData.mentions?.length) {
      await Promise.all(postData.mentions.map(async (userId) => {
        await prisma.notification.create({
          data: {
            userId,
            type: 'MENTION',
            content: `${session.user.displayName} mentioned you in a post`,
            postId: post.id,
            fromUserId: session.user.id,
          }
        });
      }));
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_POST',
        details: `Created a ${postData.visibility} post`,
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '',
        userAgent: req.headers['user-agent'] || ''
      }
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 