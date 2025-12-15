import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'

// Get user's current subscription
export async function GET(request: NextRequest) {
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
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Subscription fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      )
    }

    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        tier: 'free',
        message: 'No active subscription',
      })
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        plan_name: subscription.plan_name,
        planTier: subscription.plan_name?.toLowerCase() || 'free',
        plan_price_monthly: subscription.plan_price_monthly,
        status: subscription.status,
        payment_status: subscription.status === 'active' ? 'paid' : subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        start_date: subscription.current_period_start,
        end_date: subscription.current_period_end,
        createdAt: subscription.created_at,
      },
      tier: subscription.plan_name?.toLowerCase() || 'free',
    })
  } catch (error) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

