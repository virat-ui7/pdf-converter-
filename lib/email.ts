import formData from 'form-data'
import Mailgun from 'mailgun.js'

// Mailgun Email Service
// Reference: https://www.mailgun.com/

const mailgun = new Mailgun(formData)
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
})

const domain = process.env.MAILGUN_DOMAIN || ''

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}

/**
 * Send email using Mailgun
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.MAILGUN_API_KEY || !domain) {
      console.warn('Mailgun not configured. Email not sent:', options.to)
      return false
    }

    const messageData = {
      from: options.from || `FileConverter <noreply@${domain}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
      html: options.html,
    }

    const response = await mg.messages.create(domain, messageData)
    return !!response.id
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  verificationCode: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #FF6B35;">Verify Your Email</h1>
          <p>Thank you for signing up for FileConverter!</p>
          <p>Please enter the following verification code to complete your registration:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px;">
            ${verificationCode}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} FileConverter. All rights reserved.</p>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: 'Verify Your Email - FileConverter',
    html,
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #FF6B35;">Reset Your Password</h1>
          <p>You requested to reset your password for your FileConverter account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} FileConverter. All rights reserved.</p>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: 'Reset Your Password - FileConverter',
    html,
  })
}

/**
 * Send conversion completed email
 */
export async function sendConversionCompletedEmail(
  email: string,
  fileName: string,
  downloadUrl: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #FF6B35;">Conversion Complete!</h1>
          <p>Your file conversion has been completed successfully.</p>
          <p><strong>File:</strong> ${fileName}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download File</a>
          </div>
          <p>This download link will be available for 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} FileConverter. All rights reserved.</p>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: `Conversion Complete: ${fileName}`,
    html,
  })
}

/**
 * Send conversion failed email
 */
export async function sendConversionFailedEmail(
  email: string,
  fileName: string,
  errorMessage: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #F44336;">Conversion Failed</h1>
          <p>We're sorry, but your file conversion failed.</p>
          <p><strong>File:</strong> ${fileName}</p>
          <p><strong>Error:</strong> ${errorMessage}</p>
          <p>Please try again or contact support if the problem persists.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/convert" style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Try Again</a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} FileConverter. All rights reserved.</p>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: `Conversion Failed: ${fileName}`,
    html,
  })
}

/**
 * Send welcome email after signup
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #FF6B35;">Welcome to FileConverter!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for joining FileConverter! You can now convert files to 110+ formats instantly.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/convert" style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Converting</a>
          </div>
          <p>Need help? Check out our <a href="${process.env.NEXTAUTH_URL}/how-it-works">guide</a> or contact <a href="${process.env.NEXTAUTH_URL}/support">support</a>.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} FileConverter. All rights reserved.</p>
        </div>
      </body>
    </html>
  `

  return await sendEmail({
    to: email,
    subject: 'Welcome to FileConverter!',
    html,
  })
}

