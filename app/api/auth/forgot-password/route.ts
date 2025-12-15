import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isValidEmail, generateToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    // Don't reveal if user exists (security best practice)
    // Always return success message
    if (!user || userError) {
      // Still return success to prevent email enumeration
      return NextResponse.json(
        {
          message:
            'If an account exists with this email, a password reset link has been sent.',
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = generateToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // TODO: Store reset token in database (create password_reset_tokens table in Block 2)
    // For now, we'll just return success
    // In production, store token and send email via Mailgun

    // Send reset email
    try {
      const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
      const { sendPasswordResetEmail } = await import('@/lib/email')
      await sendPasswordResetEmail(email, resetLink)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Continue even if email fails (security: don't reveal if email exists)
    }

    return NextResponse.json(
      {
        message:
          'If an account exists with this email, a password reset link has been sent.',
        // In development, return token (remove in production)
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

