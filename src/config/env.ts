import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Next.js
  NEXT_PUBLIC_APP_URL: z.string().url(),
  
  // Authentication
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // Email (SMTP)
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_SECURE: z.string().transform(val => val === 'true'),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string().email(),
  
  // Security
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),
  
  // File Upload
  UPLOAD_DIR: z.string(),
  MAX_FILE_SIZE: z.string().transform(Number),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: z.string().transform(Number),
  RATE_LIMIT_MAX: z.string().transform(Number),
  
  // Feature Flags
  ENABLE_REGISTRATION: z.string().transform(val => val === 'true'),
  ENABLE_EMAIL_VERIFICATION: z.string().transform(val => val === 'true'),
  ENABLE_TWO_FACTOR: z.string().transform(val => val === 'true'),
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true'),
  ENABLE_MAINTENANCE_MODE: z.string().transform(val => val === 'true'),
});

export const env = envSchema.parse(process.env);

// Type for the parsed environment variables
export type Env = z.infer<typeof envSchema>; 