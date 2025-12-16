/**
 * Metrics Export Endpoint
 * GET /api/metrics - Exports metrics in Prometheus format
 */

import { NextResponse } from 'next/server'
import { exportPrometheusMetrics } from '@/lib/monitoring/metrics-exporter'

export async function GET() {
  try {
    const metrics = await exportPrometheusMetrics()
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
      },
    })
  } catch (error: any) {
    console.error('Error exporting metrics:', error)
    return NextResponse.json(
      { error: 'Failed to export metrics' },
      { status: 500 }
    )
  }
}
