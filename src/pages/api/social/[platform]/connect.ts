import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import { socialIntegrationService } from '../../../../services/SocialIntegration';
import { SUPPORTED_PLATFORMS } from '../../../../config/integrations';

const connectSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const platform = req.query.platform as string;
  if (!SUPPORTED_PLATFORMS.includes(platform as any)) {
    return res.status(400).json({ error: 'Unsupported platform' });
  }

  try {
    switch (req.method) {
      case 'POST': {
        const validation = connectSchema.safeParse(req.body);
        if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
        }

        const { code } = validation.data;

        await socialIntegrationService.connectPlatform(session.user.id, platform as any, code);

        return res.status(200).json({ message: `Connected to ${platform}` });
      }

      case 'DELETE': {
        await socialIntegrationService.disconnectPlatform(session.user.id, platform as any);

        return res.status(200).json({ message: `Disconnected from ${platform}` });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(`${platform} connection error:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 