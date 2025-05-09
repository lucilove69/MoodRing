import { Buffer } from 'buffer';

// Constants
const TOKEN_KEY = 'moodring_auth_token';
const REFRESH_TOKEN_KEY = 'moodring_refresh_token';
const TOKEN_EXPIRY_KEY = 'moodring_token_expiry';

// Token management
export function setAuthToken(token: string, expiry: number) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearAuthTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function isTokenExpired(): boolean {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  return Date.now() >= parseInt(expiry, 10);
}

// CSRF Protection
export function generateCSRFToken(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64');
}

export function validateCSRFToken(token: string): boolean {
  const storedToken = localStorage.getItem('moodring_csrf_token');
  return token === storedToken;
}

// XSS Protection
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Input Sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove on* attributes
    .trim();
}

// Password Hashing (client-side, for demonstration)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(hash).toString('base64');
}

// Secure Storage
export function secureStore(key: string, value: string) {
  try {
    const encrypted = btoa(value); // Basic encryption for demo
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Error storing secure data:', error);
  }
}

export function secureRetrieve(key: string): string | null {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return atob(encrypted); // Basic decryption for demo
  } catch (error) {
    console.error('Error retrieving secure data:', error);
    return null;
  }
}

// Rate Limiting
const rateLimits = new Map<string, { count: number; timestamp: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimits.get(key);

  if (!record) {
    rateLimits.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > windowMs) {
    rateLimits.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Content Security Policy
export const CSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https:'],
  'font-src': ["'self'", 'https:', 'data:'],
  'object-src': ["'none'"],
  'media-src': ["'self'"],
  'frame-src': ["'none'"],
};

// Security Headers
export const securityHeaders = {
  'Content-Security-Policy': Object.entries(CSP)
    .map(([key, value]) => `${key} ${value.join(' ')}`)
    .join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Export all security-related functions
export const security = {
  setAuthToken,
  getAuthToken,
  setRefreshToken,
  getRefreshToken,
  clearAuthTokens,
  isTokenExpired,
  generateCSRFToken,
  validateCSRFToken,
  sanitizeHTML,
  sanitizeInput,
  hashPassword,
  secureStore,
  secureRetrieve,
  checkRateLimit,
  securityHeaders,
}; 