import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getUnreadNotificationCount } from '../../../utils/notifications';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const count = await getUnreadNotificationCount(session.user.id);
    return res.status(200).json({ count });
  } catch (error) {
    console.error('Failed to get unread notification count:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 