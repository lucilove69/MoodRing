import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import {
  markNotificationAsRead,
  deleteNotification
} from '../../../utils/notifications';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const notificationId = req.query.id as string;
  if (!notificationId) {
    return res.status(400).json({ error: 'Notification ID is required' });
  }

  try {
    switch (req.method) {
      case 'PUT': {
        if (req.query.action === 'mark-read') {
          const notification = await markNotificationAsRead(notificationId);
          return res.status(200).json(notification);
        }
        return res.status(400).json({ error: 'Invalid action' });
      }

      case 'DELETE': {
        await deleteNotification(notificationId);
        return res.status(200).json({ message: 'Notification deleted' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notification operation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 