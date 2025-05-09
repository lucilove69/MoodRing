import { prisma } from '../lib/prisma';
import { SUPPORTED_PLATFORMS, SHARING_FEATURES, type SupportedPlatform } from '../config/integrations';
import { FacebookClient, InstagramClient, YouTubeClient, RedditClient, type ShareOptions, type ShareResult, type MediaItem } from './platforms';

interface ExtendedShareOptions extends ShareOptions {
  platform: SupportedPlatform;
  schedule?: Date;
  postId?: string;
}

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  platformId: string;
  platformData?: any;
}

class SocialIntegrationService {
  private async getPlatformClient(platform: SupportedPlatform, userId: string) {
    const connection = await prisma.socialConnection.findUnique({
      where: {
        userId_platform: {
          userId,
          platform,
        },
      },
    });

    if (!connection) {
      throw new Error(`No ${platform} connection found for user`);
    }

    if (connection.expiresAt && connection.expiresAt < new Date()) {
      await this.refreshToken(platform, connection);
    }

    return this.createPlatformClient(platform, connection);
  }

  private createPlatformClient(platform: SupportedPlatform, connection: any) {
    switch (platform) {
      case 'facebook':
        return new FacebookClient(connection);
      case 'instagram':
        return new InstagramClient(connection);
      case 'youtube':
        return new YouTubeClient(connection);
      case 'reddit':
        return new RedditClient(connection);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  private async refreshToken(platform: SupportedPlatform, connection: any) {
    const client = this.createPlatformClient(platform, connection);
    await client.refreshToken();

    // Update the connection in the database
    await prisma.socialConnection.update({
      where: {
        id: connection.id,
      },
      data: {
        accessToken: connection.accessToken,
        refreshToken: connection.refreshToken,
        expiresAt: connection.expiresAt,
      },
    });
  }

  async shareContent(userId: string, options: ExtendedShareOptions) {
    const { platform, content, media, link, title, schedule, postId } = options;
    
    // Validate content against platform constraints
    this.validateContent(platform, { content, media, link, title });

    const client = await this.getPlatformClient(platform, userId);

    // If scheduled, create a scheduled post
    if (schedule) {
      await prisma.scheduledContent.create({
        data: {
          userId,
          content: {
            content,
            media,
            link,
            title,
          },
          platforms: [platform],
          scheduledFor: schedule,
        },
      });
      return;
    }

    // Share immediately
    const result = await client.share({ content, media, link, title });

    // Store cross-post reference if this is a MoodRing post
    if (postId) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          crossPosts: {
            push: {
              platform,
              platformPostId: result.id,
              url: result.url,
              timestamp: new Date(),
            },
          },
        },
      });
    }

    return result;
  }

  private validateContent(platform: SupportedPlatform, content: ShareOptions) {
    const features = SHARING_FEATURES[platform];

    if (!features) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // Check content type support
    if (content.media) {
      const mediaTypes = content.media.map(m => m.type);
      for (const type of mediaTypes) {
        if (!features.supports.includes(type)) {
          throw new Error(`${platform} does not support ${type}`);
        }
      }
    }

    // Check content length
    if (content.content && 'maxTextLength' in features) {
      if (content.content.length > features.maxTextLength) {
        throw new Error(`Content exceeds ${platform} maximum length`);
      }
    }

    // Check media constraints
    if (content.media) {
      if ('maxImages' in features && content.media.length > features.maxImages) {
        throw new Error(`Too many media items for ${platform}`);
      }

      if ('maxVideoLength' in features) {
        const videos = content.media.filter(m => m.type === 'video');
        for (const video of videos) {
          if (video.duration && video.duration > features.maxVideoLength * 60) {
            throw new Error(`Video exceeds ${platform} maximum length`);
          }
        }
      }
    }
  }

  async connectPlatform(userId: string, platform: SupportedPlatform, code: string) {
    // Platform-specific OAuth flow
    const tokenData = await this.exchangeCode(platform, code);

    await prisma.socialConnection.upsert({
      where: {
        userId_platform: {
          userId,
          platform,
        },
      },
      update: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresAt: tokenData.expiresAt,
        platformId: tokenData.platformId,
        platformData: tokenData.platformData,
      },
      create: {
        userId,
        platform,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresAt: tokenData.expiresAt,
        platformId: tokenData.platformId,
        platformData: tokenData.platformData,
      },
    });
  }

  private async exchangeCode(platform: SupportedPlatform, code: string): Promise<TokenData> {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/${platform}/callback`;
    
    switch (platform) {
      case 'facebook': {
        const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
          method: 'POST',
          body: JSON.stringify({
            client_id: process.env.FACEBOOK_CLIENT_ID,
            client_secret: process.env.FACEBOOK_CLIENT_SECRET,
            redirect_uri: redirectUri,
            code,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange Facebook code');
        }

        const data = await response.json();
        return {
          accessToken: data.access_token,
          expiresAt: new Date(Date.now() + data.expires_in * 1000),
          platformId: data.user_id,
          platformData: data,
        };
      }

      case 'instagram': {
        // Instagram uses Facebook's OAuth system
        const fbData = await this.exchangeCode('facebook', code);
        return {
          ...fbData,
          platformId: fbData.platformData.instagram_business_account?.id,
        };
      }

      case 'youtube': {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          body: JSON.stringify({
            client_id: process.env.YOUTUBE_CLIENT_ID,
            client_secret: process.env.YOUTUBE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            code,
            grant_type: 'authorization_code',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange YouTube code');
        }

        const data = await response.json();
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: new Date(Date.now() + data.expires_in * 1000),
          platformId: data.id_token,
          platformData: data,
        };
      }

      case 'reddit': {
        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(
              `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
          }).toString(),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange Reddit code');
        }

        const data = await response.json();
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: new Date(Date.now() + data.expires_in * 1000),
          platformId: data.id,
          platformData: data,
        };
      }

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  async disconnectPlatform(userId: string, platform: SupportedPlatform) {
    await prisma.socialConnection.delete({
      where: {
        userId_platform: {
          userId,
          platform,
        },
      },
    });
  }

  async getConnectedPlatforms(userId: string) {
    const connections = await prisma.socialConnection.findMany({
      where: { userId },
      select: {
        platform: true,
        platformId: true,
        platformData: true,
        createdAt: true,
      },
    });

    return connections;
  }

  generateShareLink(platform: SupportedPlatform, data: { url: string; title?: string }) {
    const params = new URLSearchParams();
    
    switch (platform) {
      case 'facebook':
        params.set('u', data.url);
        return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
      
      case 'reddit':
        params.set('url', data.url);
        if (data.title) params.set('title', data.title);
        return `https://www.reddit.com/submit?${params.toString()}`;
      
      case 'youtube':
        // YouTube doesn't have a direct share URL, return the video URL
        return data.url;
      
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
        return null;
      
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}

export const socialIntegrationService = new SocialIntegrationService(); 