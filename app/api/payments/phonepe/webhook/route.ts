import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

// PhonePe Webhook Handler
// This endpoint receives payment status updates from PhonePe

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // PhonePe sends payment status in this format:
    // {
    //   "merchantId": "...",
    //   "merchantTransactionId": "...",
    //   "transactionId": "...",
    //   "amount": 4999,
    //   "state": "COMPLETED" | "FAILED" | "PENDING",
    //   "responseCode": "PAYMENT_SUCCESS" | "PAYMENT_ERROR",
    //   "paymentInstrument": {...}
    // }

    const {
      merchantTransactionId,
      transactionId,
      amount,
      state,
      responseCode,
    } = body

    // Verify webhook signature (if PhonePe provides one)
    // For now, we'll trust the callback (in production, verify signature)

    // Find the subscription/payment record
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('payment_transaction_id', merchantTransactionId)
      .single()

    if (subError && subError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Subscription lookup error:', subError)
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    if (state === 'COMPLETED' && responseCode === 'PAYMENT_SUCCESS') {
      // Payment successful
      if (subscription) {
        // Update existing subscription
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            payment_status: 'paid',
            payment_transaction_id: transactionId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)

        // Update user tier
        const planTier = subscription.plan_tier
        await supabase
          .from('users')
          .update({
            tier: planTier,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.user_id)
      } else {
        // Create new subscription (if not exists)
        // This would require plan info from the transaction
        // For now, we'll log it
        console.log('New subscription needed for transaction:', merchantTransactionId)
      }

      return NextResponse.json({ success: true })
    } else {
      // Payment failed
      if (subscription) {
        await supabase
          .from('subscriptions')
          .update({
            status: 'failed',
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)
      }

      return NextResponse.json({ success: true, status: 'failed' })
    }
  } catch (error) {
    console.error('PhonePe webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

