import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import crypto from 'crypto'

// Check PhonePe Payment Status
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID required' },
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
        { error: 'PhonePe configuration missing' },
        { status: 500 }
      )
    }

    // Create status check payload
    const payload = {
      merchantId: phonepeMerchantId,
      merchantTransactionId: transactionId,
    }

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')

    // Generate X-VERIFY header
    const stringToHash = `${base64Payload}/pg/v1/status${phonepeMerchantId}${phonepeSaltKey}`
    const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex')
    const xVerify = `${sha256Hash}###${phonepeSaltIndex}`

    // Check payment status
    const response = await fetch(
      `${phonepeBaseUrl}/pg/v1/status/${phonepeMerchantId}/${transactionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerify,
          'X-MERCHANT-ID': phonepeMerchantId,
          'Accept': 'application/json',
        },
      }
    )

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || 'Failed to check payment status',
        },
        { status: 500 }
      )
    }

    const paymentData = result.data

    return NextResponse.json({
      success: true,
      status: paymentData.state, // COMPLETED, FAILED, PENDING
      transactionId: paymentData.transactionId,
      amount: paymentData.amount,
      responseCode: paymentData.responseCode,
      message:
        paymentData.state === 'COMPLETED'
          ? 'Payment successful'
          : paymentData.state === 'FAILED'
          ? 'Payment failed'
          : 'Payment pending',
    })
  } catch (error) {
    console.error('PhonePe status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

