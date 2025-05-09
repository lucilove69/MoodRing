import { z } from 'zod';

export const SUPPORTED_PLATFORMS = [
  'facebook',
  'instagram',
  'youtube',
  'reddit',
] as const;

export const SUPPORTED_MAIL_PROVIDERS = [
  'gmail',
  'outlook',
  'yahoo',
  'protonmail',
] as const;

export const platformConfigSchema = z.object({
  facebook: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    scope: z.array(z.string()).default([
      'public_profile',
      'email',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
    ]),
  }),
  instagram: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    scope: z.array(z.string()).default([
      'basic',
      'publish_media',
      'pages_show_list',
    ]),
  }),
  youtube: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    scope: z.array(z.string()).default([
      'youtube.readonly',
      'youtube.upload',
      'youtube.force-ssl',
    ]),
  }),
  reddit: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    scope: z.array(z.string()).default([
      'identity',
      'submit',
      'read',
    ]),
  }),
});

export const mailProviderConfigSchema = z.object({
  gmail: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    redirectUri: z.string(),
  }),
  outlook: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    redirectUri: z.string(),
  }),
  yahoo: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    redirectUri: z.string(),
  }),
  protonmail: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    redirectUri: z.string(),
  }),
});

export type SupportedPlatform = typeof SUPPORTED_PLATFORMS[number];
export type SupportedMailProvider = typeof SUPPORTED_MAIL_PROVIDERS[number];
export type PlatformConfig = z.infer<typeof platformConfigSchema>;
export type MailProviderConfig = z.infer<typeof mailProviderConfigSchema>;

export const SHARING_FEATURES = {
  facebook: {
    supports: ['text', 'images', 'videos', 'links'],
    maxTextLength: 63206,
    maxImages: 10,
    maxVideoLength: 240, // minutes
  },
  instagram: {
    supports: ['images', 'videos'],
    aspectRatios: ['1:1', '4:5', '16:9'],
    maxImages: 10,
    maxVideoLength: 60,
  },
  youtube: {
    supports: ['videos'],
    maxVideoLength: 720,
    maxTitleLength: 100,
    maxDescriptionLength: 5000,
  },
  reddit: {
    supports: ['text', 'links', 'images', 'videos'],
    maxTitleLength: 300,
    maxTextLength: 40000,
    maxImages: 20,
  },
} as const;

export const CONTENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  LINK: 'link',
  POLL: 'poll',
  AUDIO: 'audio',
} as const;

export const ANALYTICS_FEATURES = {
  engagement: {
    metrics: ['likes', 'comments', 'shares', 'views', 'reach'],
    timeRanges: ['day', 'week', 'month', 'year'],
    breakdowns: ['platform', 'content_type', 'audience', 'time'],
  },
  audience: {
    demographics: ['age', 'gender', 'location', 'interests'],
    behavior: ['active_times', 'interaction_types', 'platform_usage'],
  },
  content: {
    performance: ['top_posts', 'trending_topics', 'best_times'],
    recommendations: ['optimal_posting_times', 'content_ideas', 'hashtags'],
  },
} as const; 