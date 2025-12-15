import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const keyId = params.id

    // Verify ownership
    const { data: key, error: fetchError } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('id', keyId)
      .single()

    if (fetchError || !key || key.user_id !== userId) {
      return NextResponse.json(
        { error: 'API key not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete API key
    const { error } = await supabase.from('api_keys').delete().eq('id', keyId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete API key' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete API key error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

