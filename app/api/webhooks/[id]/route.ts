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
    const webhookId = params.id

    // Verify ownership
    const { data: webhook, error: fetchError } = await supabase
      .from('webhooks')
      .select('user_id')
      .eq('id', webhookId)
      .single()

    if (fetchError || !webhook || webhook.user_id !== userId) {
      return NextResponse.json(
        { error: 'Webhook not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete webhook
    const { error } = await supabase.from('webhooks').delete().eq('id', webhookId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete webhook' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

