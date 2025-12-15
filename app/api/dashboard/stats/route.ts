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

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('tier, conversions_used, storage_used_mb')
      .eq('id', userId)
      .single()

    if (userError) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    const tier = user.tier || 'free'
    const conversionsUsed = user.conversions_used || 0
    const storageUsed = user.storage_used_mb || 0

    // Get API usage (if applicable)
    const { data: apiKeys } = await supabase
      .from('api_keys')
      .select('last_used_at')
      .eq('user_id', userId)
      .eq('is_active', true)

    const apiCalls = apiKeys?.length || 0 // Simplified - would need proper tracking

    // Define limits based on tier
    const limits = {
      free: {
        conversions: 200,
        storage: 100, // MB
        api: 0,
      },
      starter: {
        conversions: 1000,
        storage: 500, // MB
        api: 0,
      },
      professional: {
        conversions: 10000,
        storage: 2000, // MB (2GB)
        api: 1000,
      },
      enterprise: {
        conversions: Infinity,
        storage: Infinity,
        api: Infinity,
      },
    }

    const tierLimits = limits[tier as keyof typeof limits] || limits.free

    return NextResponse.json({
      tier,
      conversionsUsed,
      conversionsLimit: tierLimits.conversions,
      storageUsed,
      storageLimit: tierLimits.storage,
      apiCalls,
      apiLimit: tierLimits.api,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

