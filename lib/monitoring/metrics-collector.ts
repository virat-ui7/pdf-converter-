/**
 * Metrics Collector
 * Centralized metrics collection for monitoring and alerting
 */

import { supabase } from '@/lib/supabase'
import { conversionQueue } from '@/lib/queue'

export interface Metrics {
  // Conversion metrics
  conversion_success_total: number
  conversion_failure_total: number
  conversion_duration_seconds: Record<string, number[]> // format_pair -> durations
  conversion_by_format_pair: Record<string, { success: number; failure: number }>
  
  // Validation metrics
  validation_file_size_rejections: number
  validation_magic_bytes_rejections: number
  validation_unsupported_rejections: number
  validation_total_rejections: number
  
  // Performance metrics
  api_response_time_ms: number[]
  queue_depth: number
  queue_waiting: number
  queue_active: number
  worker_utilization: number
  
  // Error metrics
  api_errors_4xx: number
  api_errors_5xx: number
  worker_crashes: number
  
  // Tier usage metrics
  tier_usage: Record<string, { conversions: number; rejections: number }>
  
  // Security metrics
  auth_failures: number
  rate_limit_hits: number
  suspicious_validation_failures: number
}

/**
 * Collect all metrics from database and queue
 */
export async function collectAllMetrics(): Promise<Partial<Metrics>> {
  const metrics: Partial<Metrics> = {}
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  try {
    // Conversion metrics (last 24h)
    const { data: conversions } = await supabase
      .from('conversions')
      .select('status, original_format, target_format, processing_time_seconds, error_message, created_at')
      .gte('created_at', last24h.toISOString())

    if (conversions) {
      const successful = conversions.filter((c) => c.status === 'completed')
      const failed = conversions.filter((c) => c.status === 'failed')
      
      metrics.conversion_success_total = successful.length
      metrics.conversion_failure_total = failed.length
      
      // Group by format pair
      const formatPairs: Record<string, { success: number; failure: number }> = {}
      const durations: Record<string, number[]> = {}
      
      conversions.forEach((c) => {
        const pair = `${c.original_format}→${c.target_format}`
        if (!formatPairs[pair]) {
          formatPairs[pair] = { success: 0, failure: 0 }
          durations[pair] = []
        }
        
        if (c.status === 'completed') {
          formatPairs[pair].success++
          if (c.processing_time_seconds) {
            durations[pair].push(c.processing_time_seconds)
          }
        } else {
          formatPairs[pair].failure++
        }
      })
      
      metrics.conversion_by_format_pair = formatPairs
      metrics.conversion_duration_seconds = durations
    }

    // Validation rejection metrics
    const { data: recentConversions } = await supabase
      .from('conversions')
      .select('error_message, status')
      .gte('created_at', last24h.toISOString())
      .eq('status', 'failed')

    if (recentConversions) {
      let fileSizeRejections = 0
      let magicBytesRejections = 0
      let unsupportedRejections = 0

      recentConversions.forEach((c) => {
        const error = c.error_message?.toLowerCase() || ''
        if (error.includes('file size') || error.includes('exceeds') || error.includes('limit')) {
          fileSizeRejections++
        } else if (error.includes('magic bytes') || error.includes('content does not match') || error.includes('corrupted')) {
          magicBytesRejections++
        } else if (error.includes('not supported') || error.includes('unsupported')) {
          unsupportedRejections++
        }
      })

      metrics.validation_file_size_rejections = fileSizeRejections
      metrics.validation_magic_bytes_rejections = magicBytesRejections
      metrics.validation_unsupported_rejections = unsupportedRejections
      metrics.validation_total_rejections = recentConversions.length
    }

    // Queue metrics
    try {
      const waiting = await conversionQueue.getWaitingCount()
      const active = await conversionQueue.getActiveCount()
      const completed = await conversionQueue.getCompletedCount()
      const failed = await conversionQueue.getFailedCount()
      
      metrics.queue_depth = waiting + active
      metrics.queue_waiting = waiting
      metrics.queue_active = active
      
      // Worker utilization (active / (active + completed + failed))
      const totalProcessed = active + completed + failed
      metrics.worker_utilization = totalProcessed > 0 ? (active / totalProcessed) * 100 : 0
    } catch (error) {
      console.error('Error fetching queue metrics:', error)
    }

    // Tier usage metrics
    const { data: tierUsage } = await supabase
      .from('conversions')
      .select('user_id, status, error_message')
      .gte('created_at', last24h.toISOString())

    if (tierUsage) {
      // Get user tiers
      const userIds = [...new Set(tierUsage.map((c) => c.user_id).filter(Boolean))]
      const { data: users } = await supabase
        .from('users')
        .select('id, tier')
        .in('id', userIds)

      const tierMap = new Map(users?.map((u) => [u.id, u.tier]) || [])
      
      const tierStats: Record<string, { conversions: number; rejections: number }> = {
        free: { conversions: 0, rejections: 0 },
        starter: { conversions: 0, rejections: 0 },
        professional: { conversions: 0, rejections: 0 },
        enterprise: { conversions: 0, rejections: 0 },
      }

      tierUsage.forEach((c) => {
        const tier = c.user_id ? (tierMap.get(c.user_id) || 'free') : 'free'
        if (!tierStats[tier]) tierStats[tier] = { conversions: 0, rejections: 0 }
        
        tierStats[tier].conversions++
        if (c.status === 'failed') {
          tierStats[tier].rejections++
        }
      })

      metrics.tier_usage = tierStats
    }

    // Error metrics (from analytics table if available)
    const { data: errorEvents } = await supabase
      .from('analytics')
      .select('event_type, event_data')
      .gte('created_at', last24h.toISOString())
      .in('event_type', ['api_error_4xx', 'api_error_5xx', 'worker_crash'])

    if (errorEvents) {
      metrics.api_errors_4xx = errorEvents.filter((e) => e.event_type === 'api_error_4xx').length
      metrics.api_errors_5xx = errorEvents.filter((e) => e.event_type === 'api_error_5xx').length
      metrics.worker_crashes = errorEvents.filter((e) => e.event_type === 'worker_crash').length
    }

    // Security metrics
    const { data: authEvents } = await supabase
      .from('analytics')
      .select('event_type')
      .gte('created_at', last24h.toISOString())
      .in('event_type', ['auth_failure', 'rate_limit_hit', 'suspicious_validation'])

    if (authEvents) {
      metrics.auth_failures = authEvents.filter((e) => e.event_type === 'auth_failure').length
      metrics.rate_limit_hits = authEvents.filter((e) => e.event_type === 'rate_limit_hit').length
      metrics.suspicious_validation_failures = authEvents.filter((e) => e.event_type === 'suspicious_validation').length
    }

  } catch (error) {
    console.error('Error collecting metrics:', error)
  }

  return metrics
}

/**
 * Record a conversion metric
 */
export async function recordConversionMetric(
  sourceFormat: string,
  targetFormat: string,
  status: 'success' | 'failure',
  durationSeconds?: number,
  errorMessage?: string
) {
  try {
    await supabase.from('analytics').insert({
      event_type: status === 'success' ? 'conversion_completed' : 'conversion_failed',
      event_data: {
        source_format: sourceFormat,
        target_format: targetFormat,
        duration_seconds: durationSeconds,
        error_message: errorMessage,
      },
    })
  } catch (error) {
    console.error('Error recording conversion metric:', error)
  }
}

/**
 * Record a validation rejection
 */
export async function recordValidationRejection(
  reason: 'file_size' | 'magic_bytes' | 'unsupported' | 'other',
  details?: Record<string, any>
) {
  try {
    await supabase.from('analytics').insert({
      event_type: 'validation_rejection',
      event_data: {
        reason,
        ...details,
      },
    })
  } catch (error) {
    console.error('Error recording validation rejection:', error)
  }
}

/**
 * Record an API error
 */
export async function recordAPIError(statusCode: number, endpoint: string, error?: string) {
  try {
    const eventType = statusCode >= 500 ? 'api_error_5xx' : 'api_error_4xx'
    await supabase.from('analytics').insert({
      event_type: eventType,
      event_data: {
        status_code: statusCode,
        endpoint,
        error,
      },
    })
  } catch (error) {
    console.error('Error recording API error:', error)
  }
}

/**
 * Record a security event
 */
export async function recordSecurityEvent(
  eventType: 'auth_failure' | 'rate_limit_hit' | 'suspicious_validation',
  details?: Record<string, any>
) {
  try {
    await supabase.from('analytics').insert({
      event_type: eventType,
      event_data: details || {},
    })
  } catch (error) {
    console.error('Error recording security event:', error)
  }
}
