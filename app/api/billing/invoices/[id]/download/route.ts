import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'

export async function GET(
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
    const invoiceId = params.id

    // Verify invoice belongs to user
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .single()

    if (error || !subscription) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Generate invoice PDF (simplified - in production, use a PDF library)
    const invoiceNumber = `INV-${subscription.id.substring(0, 8).toUpperCase()}`
    const invoiceDate = new Date(subscription.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Create simple HTML invoice
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Invoice ${invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #FF6B35; padding-bottom: 20px; margin-bottom: 30px; }
            .invoice-number { font-size: 24px; font-weight: bold; color: #FF6B35; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .table th { background-color: #f5f5f5; font-weight: bold; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FileConverter</h1>
            <div class="invoice-number">Invoice ${invoiceNumber}</div>
          </div>
          <div class="details">
            <div>
              <strong>Bill To:</strong><br>
              ${session.user?.email || 'N/A'}<br>
            </div>
            <div>
              <strong>Invoice Date:</strong> ${invoiceDate}<br>
              <strong>Billing Period:</strong> ${new Date(subscription.start_date).toLocaleDateString()} - ${new Date(subscription.end_date).toLocaleDateString()}<br>
              <strong>Status:</strong> ${subscription.payment_status || 'Paid'}
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${subscription.plan_tier.charAt(0).toUpperCase() + subscription.plan_tier.slice(1)} Plan - ${subscription.billing_cycle || 'Monthly'}</td>
                <td>${subscription.currency || 'USD'} ${subscription.plan_price_monthly || 0}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total: ${subscription.currency || 'USD'} ${subscription.plan_price_monthly || 0}
          </div>
        </body>
      </html>
    `

    // Return as HTML (in production, convert to PDF)
    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="invoice-${invoiceNumber}.html"`,
      },
    })
  } catch (error) {
    console.error('Invoice download error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

