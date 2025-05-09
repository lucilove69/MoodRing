import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute

const querySchema = z.object({
  key: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const queryValidation = querySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(400).json({ error: queryValidation.error.errors });
    }

    const { key } = queryValidation.data;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - RATE_LIMIT_WINDOW;

    // Get or create rate limit record
    const rateLimit = await prisma.rateLimit.upsert({
      where: { key },
      update: {
        count: {
          increment: 1,
        },
        resetAt: new Date((windowStart + RATE_LIMIT_WINDOW) * 1000),
      },
      create: {
        key,
        count: 1,
        resetAt: new Date((windowStart + RATE_LIMIT_WINDOW) * 1000),
      },
    });

    // Clean up old rate limit records
    await prisma.rateLimit.deleteMany({
      where: {
        resetAt: {
          lt: new Date(windowStart * 1000),
        },
      },
    });

    const remaining = Math.max(0, RATE_LIMIT_MAX - rateLimit.count);
    const reset = Math.floor(rateLimit.resetAt.getTime() / 1000);

    return res.status(200).json({
      limit: RATE_LIMIT_MAX,
      remaining,
      reset,
    });
  } catch (error) {
    console.error('Rate limit error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 