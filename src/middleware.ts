import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from './lib/prisma';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'anonymous';
}

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes that don't need auth
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  if (
    request.nextUrl.pathname.startsWith('/api/social') ||
    request.nextUrl.pathname.startsWith('/social')
  ) {
    const token = await getToken({ req: request });
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = getClientIp(request);
    const key = `rate_limit:${ip}`;

    // Get current rate limit
    const rateLimit = await prisma.rateLimit.findUnique({
      where: { key },
    });

    const now = new Date();

    if (rateLimit) {
      // Check if window has expired
      if (rateLimit.resetAt < now) {
        // Reset counter
        await prisma.rateLimit.update({
          where: { key },
          data: {
            count: 1,
            resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW),
          },
        });
      } else if (rateLimit.count >= MAX_REQUESTS) {
        // Rate limit exceeded
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests',
            retryAfter: Math.ceil((rateLimit.resetAt.getTime() - now.getTime()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil(
                (rateLimit.resetAt.getTime() - now.getTime()) / 1000
              ).toString(),
            },
          }
        );
      } else {
        // Increment counter
        await prisma.rateLimit.update({
          where: { key },
          data: {
            count: rateLimit.count + 1,
          },
        });
      }
    } else {
      // Create new rate limit
      await prisma.rateLimit.create({
        data: {
          key,
          count: 1,
          resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW),
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/social/:path*',
  ],
}; 