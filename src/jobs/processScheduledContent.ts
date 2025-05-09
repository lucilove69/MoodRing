import { prisma } from '../lib/prisma';
import { socialIntegrationService } from '../services/SocialIntegration';
import { type SupportedPlatform } from '../config/integrations';

export async function processScheduledContent() {
  try {
    // Find all pending scheduled content that's due
    const scheduledContent = await prisma.scheduledContent.findMany({
      where: {
        status: 'pending',
        scheduledFor: {
          lte: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    // Process each scheduled content
    for (const content of scheduledContent) {
      try {
        // Share to each platform
        const results = await Promise.all(
          content.platforms.map((platform: SupportedPlatform) =>
            socialIntegrationService.shareContent(content.userId, {
              platform,
              content: content.content.content,
              media: content.content.media,
              link: content.content.link,
              title: content.content.title,
            })
          )
        );

        // Update status to published
        await prisma.scheduledContent.update({
          where: { id: content.id },
          data: {
            status: 'published',
            content: {
              ...content.content,
              results,
            },
          },
        });
      } catch (error) {
        // Update status to failed
        await prisma.scheduledContent.update({
          where: { id: content.id },
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });

        console.error(`Failed to process scheduled content ${content.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error processing scheduled content:', error);
  }
}

// Run the job every minute
export function startScheduledContentProcessor() {
  setInterval(processScheduledContent, 60 * 1000);
  // Also run immediately on startup
  processScheduledContent();
} 