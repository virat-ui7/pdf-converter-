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
    const user = session.user as any
    const tier = user.tier || 'free'

    // Check if user has API access
    if (tier !== 'professional' && tier !== 'enterprise') {
      return NextResponse.json(
        { error: 'Webhooks require Professional or Enterprise plan' },
        { status: 403 }
      )
    }

    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch webhooks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ webhooks: webhooks || [] })
  } catch (error) {
    console.error('Get webhooks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const user = session.user as any
    const tier = user.tier || 'free'

    // Check if user has API access
    if (tier !== 'professional' && tier !== 'enterprise') {
      return NextResponse.json(
        { error: 'Webhooks require Professional or Enterprise plan' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { url, eventType } = body

    if (!url || !url.trim()) {
      return NextResponse.json(
        { error: 'Webhook URL is required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid webhook URL' },
        { status: 400 }
      )
    }

    // Create webhook
    const { data, error } = await supabase
      .from('webhooks')
      .insert({
        user_id: userId,
        url: url.trim(),
        event_type: eventType || 'conversion.completed',
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create webhook' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      webhook: data,
    })
  } catch (error) {
    console.error('Create webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

