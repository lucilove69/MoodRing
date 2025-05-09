import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import { socialIntegrationService } from '../../../services/SocialIntegration';
import { SUPPORTED_PLATFORMS, CONTENT_TYPES } from '../../../config/integrations';

const mediaSchema = z.object({
  type: z.enum(['image', 'video', 'audio']),
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  duration: z.number().optional(),
});

const shareSchema = z.object({
  platforms: z.array(z.enum(SUPPORTED_PLATFORMS)),
  content: z.string(),
  media: z.array(mediaSchema).optional(),
  link: z.string().url().optional(),
  title: z.string().optional(),
  schedule: z.string().datetime().optional(),
  postId: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validation = shareSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { platforms, schedule, ...shareData } = validation.data;
    const scheduledDate = schedule ? new Date(schedule) : undefined;

    // Share to each platform
    const results = await Promise.all(
      platforms.map(platform =>
        socialIntegrationService.shareContent(session.user.id, {
          platform,
          schedule: scheduledDate,
          ...shareData,
        })
      )
    );

    return res.status(200).json({
      message: 'Content shared successfully',
      results: results.filter(Boolean), // Filter out undefined results (from scheduled posts)
    });
  } catch (error) {
    console.error('Social share error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 