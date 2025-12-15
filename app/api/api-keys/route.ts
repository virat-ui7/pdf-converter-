import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

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
        { error: 'API access requires Professional or Enterprise plan' },
        { status: 403 }
      )
    }

    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, name, key_hash, last_used_at, is_active, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch API keys' },
        { status: 500 }
      )
    }

    // Return keys with masked hash (show first 8 characters)
    const maskedKeys = keys.map((key) => ({
      id: key.id,
      name: key.name,
      key_prefix: key.key_hash.substring(0, 8),
      last_used_at: key.last_used_at,
      is_active: key.is_active,
      created_at: key.created_at,
    }))

    return NextResponse.json({ keys: maskedKeys })
  } catch (error) {
    console.error('Get API keys error:', error)
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
        { error: 'API access requires Professional or Enterprise plan' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      )
    }

    // Generate API key
    const apiKey = `fc_${crypto.randomBytes(32).toString('hex')}`
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex')

    // Store in database
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        name: name.trim(),
        key_hash: keyHash,
        permissions: ['read', 'write'],
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      )
    }

    // Return the actual key (only shown once)
    return NextResponse.json({
      success: true,
      apiKey,
      keyId: data.id,
    })
  } catch (error) {
    console.error('Create API key error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

