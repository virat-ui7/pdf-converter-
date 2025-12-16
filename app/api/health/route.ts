import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { conversionQueue } from '@/lib/queue'
import { collectAllMetrics } from '@/lib/monitoring/metrics-collector'

const startTime = Date.now()

/**
 * GET /health/live
 * Liveness probe - returns 200 if API is responding
 * Used by load balancer to detect dead instances
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const healthType = url.searchParams.get('type') || 'ready'

  try {
    // Liveness check - just verify API is responding
    if (healthType === 'live') {
      return NextResponse.json(
        {
          status: 'ok',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    }

    // Readiness check - verify dependencies
    if (healthType === 'ready') {
      const checks: Record<string, string> = {}
      let allHealthy = true

      // Check database
      const { error: dbError } = await supabase.from('users').select('id').limit(1)
      checks.database = dbError ? 'error' : 'ok'
      if (dbError) allHealthy = false

      // Check queue (basic connectivity)
      try {
        await conversionQueue.getWaitingCount()
        checks.queue = 'ok'
      } catch (error) {
        checks.queue = 'error'
        allHealthy = false
      }

      // Check storage (Supabase storage is part of database)
      checks.storage = dbError ? 'error' : 'ok'

      const status = allHealthy ? 200 : 503
      return NextResponse.json(
        {
          status: allHealthy ? 'ok' : 'degraded',
          timestamp: new Date().toISOString(),
          services: checks,
        },
        { status }
      )
    }

    // Deep health check - full system status
    if (healthType === 'deep') {
      const checks: Record<string, any> = {}
      let allHealthy = true

      // Database check
      const dbStart = Date.now()
      const { error: dbError, data: dbData } = await supabase
        .from('users')
        .select('id')
        .limit(1)
      const dbLatency = Date.now() - dbStart
      checks.database = {
        status: dbError ? 'error' : 'ok',
        latency_ms: dbLatency,
        error: dbError?.message,
      }
      if (dbError) allHealthy = false

      // Queue check
      try {
        const queueStart = Date.now()
        const waiting = await conversionQueue.getWaitingCount()
        const active = await conversionQueue.getActiveCount()
        const queueLatency = Date.now() - queueStart
        checks.queue = {
          status: 'ok',
          latency_ms: queueLatency,
          waiting: waiting,
          active: active,
        }
      } catch (error: any) {
        checks.queue = {
          status: 'error',
          error: error.message,
        }
        allHealthy = false
      }

      // Storage check (Supabase)
      checks.storage = {
        status: dbError ? 'error' : 'ok',
        provider: 'supabase',
      }

      // Recent conversion success rate
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const { data: recentConversions } = await supabase
        .from('conversions')
        .select('status')
        .gte('created_at', yesterday.toISOString())
        .limit(1000)

      let successRate = 1.0
      if (recentConversions && recentConversions.length > 0) {
        const completed = recentConversions.filter((c) => c.status === 'completed').length
        successRate = completed / recentConversions.length
      }

      checks.conversions = {
        recent_success_rate: successRate,
        sample_size: recentConversions?.length || 0,
      }

      // Collect metrics
      const metrics = await collectAllMetrics()
      checks.metrics = {
        collected: Object.keys(metrics).length,
        sample: Object.fromEntries(Object.entries(metrics).slice(0, 10)),
      }

      // Calculate uptime
      const uptime = Math.floor((Date.now() - startTime) / 1000)

      return NextResponse.json(
        {
          status: allHealthy ? 'ok' : 'degraded',
          timestamp: new Date().toISOString(),
          uptime: {
            seconds: uptime,
            formatted: formatUptime(uptime),
          },
          version: process.env.npm_package_version || '1.0.0',
          checks,
        },
        { status: allHealthy ? 200 : 503 }
      )
    }

    // Default: readiness check
    return GET(new Request(request.url + '?type=ready'))
  } catch (error: any) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        error_message: error.message,
      },
      { status: 500 }
    )
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}
