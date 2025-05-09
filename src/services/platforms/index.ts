import { SocialConnection } from '@prisma/client';
import { z } from 'zod';

export interface ShareResult {
  id: string;
  url: string;
  platform: string;
}

export interface MediaItem {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number;
}

export interface ShareOptions {
  content: string;
  media?: MediaItem[];
  link?: string;
  title?: string;
}

abstract class BasePlatformClient {
  protected connection: SocialConnection;

  constructor(connection: SocialConnection) {
    this.connection = connection;
  }

  protected async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.connection.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  abstract share(options: ShareOptions): Promise<ShareResult>;
  abstract refreshToken(): Promise<void>;
}

export class FacebookClient extends BasePlatformClient {
  async share(options: ShareOptions): Promise<ShareResult> {
    const { content, media, link } = options;
    
    const response = await this.makeRequest('https://graph.facebook.com/v18.0/me/feed', {
      method: 'POST',
      body: JSON.stringify({
        message: content,
        link: link,
        // Handle media attachments if present
        ...(media && { attached_media: media.map(m => ({ media_fbid: m.url })) }),
      }),
    });

    return {
      id: response.id,
      url: `https://facebook.com/${response.id}`,
      platform: 'facebook',
    };
  }

  async refreshToken(): Promise<void> {
    const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'fb_exchange_token',
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        fb_exchange_token: this.connection.accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Facebook token');
    }

    const data = await response.json();
    // Update the connection in the database
    // This should be handled by the SocialIntegrationService
  }
}

export class InstagramClient extends BasePlatformClient {
  async share(options: ShareOptions): Promise<ShareResult> {
    const { content, media } = options;
    
    if (!media || media.length === 0) {
      throw new Error('Instagram requires at least one media item');
    }

    // First, create a container
    const container = await this.makeRequest('https://graph.facebook.com/v18.0/instagram_oembed', {
      method: 'POST',
      body: JSON.stringify({
        media_type: media[0].type === 'image' ? 'IMAGE' : 'VIDEO',
        media_url: media[0].url,
        caption: content,
      }),
    });

    // Then publish the container
    const response = await this.makeRequest(`https://graph.facebook.com/v18.0/${container.id}/publish`, {
      method: 'POST',
    });

    return {
      id: response.id,
      url: `https://instagram.com/p/${response.id}`,
      platform: 'instagram',
    };
  }

  async refreshToken(): Promise<void> {
    // Instagram uses Facebook's token system
    const fbClient = new FacebookClient(this.connection);
    await fbClient.refreshToken();
  }
}

export class YouTubeClient extends BasePlatformClient {
  async share(options: ShareOptions): Promise<ShareResult> {
    const { content, media, title } = options;
    
    if (!media || media.length === 0 || media[0].type !== 'video') {
      throw new Error('YouTube requires a video');
    }

    const response = await this.makeRequest('https://www.googleapis.com/upload/youtube/v3/videos', {
      method: 'POST',
      body: JSON.stringify({
        snippet: {
          title: title || 'Shared from MoodRing',
          description: content,
        },
        status: {
          privacyStatus: 'public',
        },
      }),
    });

    return {
      id: response.id,
      url: `https://youtube.com/watch?v=${response.id}`,
      platform: 'youtube',
    };
  }

  async refreshToken(): Promise<void> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        refresh_token: this.connection.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh YouTube token');
    }

    const data = await response.json();
    // Update the connection in the database
    // This should be handled by the SocialIntegrationService
  }
}

export class RedditClient extends BasePlatformClient {
  async share(options: ShareOptions): Promise<ShareResult> {
    const { content, title, link } = options;
    
    const response = await this.makeRequest('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      body: JSON.stringify({
        kind: link ? 'link' : 'self',
        title: title || 'Shared from MoodRing',
        text: content,
        url: link,
      }),
    });

    return {
      id: response.data.id,
      url: `https://reddit.com${response.data.permalink}`,
      platform: 'reddit',
    };
  }

  async refreshToken(): Promise<void> {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.connection.refreshToken || '',
      }).toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Reddit token');
    }

    const data = await response.json();
    // Update the connection in the database
    // This should be handled by the SocialIntegrationService
  }
} 