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

    const body = await request.json()
    const { newPlan, billingCycle = 'monthly' } = body

    if (!newPlan) {
      return NextResponse.json(
        { error: 'New plan is required' },
        { status: 400 }
      )
    }

    const userId = (session.user as any).id

    // Get current subscription
    const { data: currentSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Plan pricing (in cents for USD, paise for INR)
    const planPricing: Record<string, { monthly: number; yearly: number }> = {
      starter: { monthly: 499, yearly: 3999 },
      professional: { monthly: 1499, yearly: 11999 },
      enterprise: { monthly: 4999, yearly: 39999 },
    }

    const price = planPricing[newPlan.toLowerCase()]?.[billingCycle as 'monthly' | 'yearly']

    if (!price) {
      return NextResponse.json(
        { error: 'Invalid plan or billing cycle' },
        { status: 400 }
      )
    }

    // If user has an active subscription, we'll handle upgrade/downgrade
    // For now, redirect to checkout with the new plan
    // In production, you'd handle prorating and immediate changes

    return NextResponse.json({
      success: true,
      message: 'Redirect to checkout to complete upgrade',
      checkoutUrl: `/checkout?plan=${newPlan}&billing=${billingCycle}`,
      newPlan,
      billingCycle,
      price,
    })
  } catch (error) {
    console.error('Upgrade error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

