import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')
    const format = searchParams.get('format')

    // Build query
    let query = supabase
      .from('conversions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by user if logged in
    if (session?.user) {
      query = query.eq('user_id', (session.user as any).id)
    } else {
      // For anonymous users, we'd need to track by session/IP
      // For now, return empty
      return NextResponse.json({
        conversions: [],
        total: 0,
        limit,
        offset,
      })
    }

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (format) {
      query = query.or(`original_format.eq.${format},target_format.eq.${format}`)
    }

    const { data: conversions, error, count } = await query

    if (error) {
      console.error('Conversions fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      conversions: conversions || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Conversions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

