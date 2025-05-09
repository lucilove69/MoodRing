import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?code=${code}`;
  
  await transporter.sendMail({
    from: `"MoodRing" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Verify your MoodRing account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a90e2;">Welcome to MoodRing!</h1>
        <p>Thank you for creating an account. To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationLink}</p>
        <p>This verification link will expire in 24 hours.</p>
        <p>If you didn't create this account, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `
  });
}

export async function sendPasswordResetEmail(email: string, code: string): Promise<void> {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?code=${code}`;
  
  await transporter.sendMail({
    from: `"MoodRing" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Reset your MoodRing password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a90e2;">Password Reset Request</h1>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetLink}</p>
        <p>This reset link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `
  });
}

export async function sendTwoFactorEmail(email: string, code: string): Promise<void> {
  await transporter.sendMail({
    from: `"MoodRing" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Your MoodRing 2FA Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a90e2;">Two-Factor Authentication</h1>
        <p>Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; font-size: 24px; letter-spacing: 5px;">
            ${code}
          </div>
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please secure your account immediately.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `
  });
}

export async function sendSecurityAlertEmail(email: string, details: string): Promise<void> {
  await transporter.sendMail({
    from: `"MoodRing" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: 'Security Alert - MoodRing Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e24a4a;">Security Alert</h1>
        <p>We detected unusual activity on your account:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0;">${details}</p>
        </div>
        <p>If this wasn't you, please secure your account immediately by:</p>
        <ol>
          <li>Changing your password</li>
          <li>Enabling two-factor authentication</li>
          <li>Reviewing your recent activity</li>
        </ol>
        <p>You can do this by visiting your account security settings.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    `
  });
} 