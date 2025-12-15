import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateVerificationCode, isValidEmail } from '@/lib/auth-utils'

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

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, email_verified')
      .eq('email', email)
      .single()

    if (!user || userError) {
      // Don't reveal if user exists (security best practice)
      return NextResponse.json(
        {
          message:
            'If an account exists with this email, a verification code has been sent.',
        },
        { status: 200 }
      )
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // Code expires in 10 minutes

    // Update user with new verification code
    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_code: verificationCode,
        verification_code_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Resend verification code error:', updateError)
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      )
    }

    // Send verification email
    try {
      const { sendVerificationEmail } = await import('@/lib/email')
      await sendVerificationEmail(email, verificationCode)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        message:
          'If an account exists with this email, a verification code has been sent.',
        // In development, return code (remove in production)
        verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

