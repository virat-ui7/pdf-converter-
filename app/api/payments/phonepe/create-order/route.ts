import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import crypto from 'crypto'

// PhonePe Payment Gateway Integration
// Reference: https://developer.phonepe.com/

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plan, amount, currency, email } = body

    // Validation
    if (!plan || !amount || currency !== 'INR') {
      return NextResponse.json(
        { error: 'Invalid payment parameters' },
        { status: 400 }
      )
    }

    // PhonePe configuration
    const phonepeMerchantId = process.env.PHONEPE_MERCHANT_ID
    const phonepeSaltKey = process.env.PHONEPE_SALT_KEY
    const phonepeSaltIndex = process.env.PHONEPE_SALT_INDEX || '1'
    const phonepeBaseUrl =
      process.env.PHONEPE_ENV === 'production'
        ? 'https://api.phonepe.com/apis/hermes'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox'

    if (!phonepeMerchantId || !phonepeSaltKey) {
      return NextResponse.json(
        {
          error: 'PhonePe configuration missing. Please set PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY in environment variables.',
        },
        { status: 500 }
      )
    }

    // Generate transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create payment payload
    const payload = {
      merchantId: phonepeMerchantId,
      merchantTransactionId: transactionId,
      merchantUserId: session.user.id,
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      redirectUrl: `${process.env.NEXTAUTH_URL}/payment/callback?transactionId=${transactionId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/payments/phonepe/webhook`,
      mobileNumber: '', // Optional
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    }

    // Create base64 encoded payload
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')

    // Generate X-VERIFY header (SHA256 hash)
    const stringToHash = `${base64Payload}/pg/v1/pay${phonepeSaltKey}`
    const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex')
    const xVerify = `${sha256Hash}###${phonepeSaltIndex}`

    // Make API call to PhonePe
    const response = await fetch(`${phonepeBaseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    })

    const result = await response.json()

    if (!response.ok || result.success !== true) {
      console.error('PhonePe API error:', result)
      return NextResponse.json(
        {
          error: result.message || 'Failed to initialize payment',
        },
        { status: 500 }
      )
    }

    // Return payment URL for redirect
    return NextResponse.json({
      success: true,
      paymentUrl: result.data.instrumentResponse.redirectInfo.url,
      transactionId,
    })
  } catch (error) {
    console.error('PhonePe payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

