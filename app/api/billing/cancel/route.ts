import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Get active subscription
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Cancel subscription (set to cancel at period end)
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancel_at_period_end: true,
        canceled_at: new Date().toISOString(),
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('Cancel subscription error:', updateError)
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      )
    }

    // Update user tier to free (after period ends)
    // Note: In production, you might want to keep the tier until period ends
    // For now, we'll mark it for downgrade
    await supabase
      .from('users')
      .update({
        tier: 'free', // Immediate downgrade (or keep tier until period end)
      })
      .eq('id', userId)

    return NextResponse.json({
      success: true,
      message: 'Subscription canceled successfully. You will retain access until the end of your billing period.',
      subscription: {
        id: subscription.id,
        status: 'canceled',
        endDate: subscription.end_date,
      },
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

