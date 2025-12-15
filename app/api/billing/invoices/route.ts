import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'

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
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Get user's subscriptions (which act as invoices)
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Invoices fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      )
    }

    // Format subscriptions as invoices
    const invoices = subscriptions?.map((sub) => ({
      id: sub.id,
      invoiceNumber: `INV-${sub.id.substring(0, 8).toUpperCase()}`,
      amount: sub.plan_price_monthly || 0,
      currency: sub.currency || 'USD',
      status: sub.payment_status || 'paid',
      planTier: sub.plan_tier,
      billingPeriod: {
        start: sub.start_date,
        end: sub.end_date,
      },
      createdAt: sub.created_at,
      paidAt: sub.payment_status === 'paid' ? sub.created_at : null,
      downloadUrl: `/api/billing/invoices/${sub.id}/download`,
    })) || []

    // Get total count
    const { count } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    return NextResponse.json({
      invoices,
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    })
  } catch (error) {
    console.error('Invoices fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

