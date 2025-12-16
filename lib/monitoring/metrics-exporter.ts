/**
 * Metrics Exporter
 * Exports metrics in Prometheus format for scraping
 */

import { collectAllMetrics } from './metrics-collector'

/**
 * Export metrics in Prometheus format
 */
export async function exportPrometheusMetrics(): Promise<string> {
  const metrics = await collectAllMetrics()
  const lines: string[] = []

  // Conversion success/failure counters
  if (metrics.conversion_success_total !== undefined) {
    lines.push(`# HELP conversion_success_total Total number of successful conversions`)
    lines.push(`# TYPE conversion_success_total counter`)
    lines.push(`conversion_success_total ${metrics.conversion_success_total}`)
  }

  if (metrics.conversion_failure_total !== undefined) {
    lines.push(`# HELP conversion_failure_total Total number of failed conversions`)
    lines.push(`# TYPE conversion_failure_total counter`)
    lines.push(`conversion_failure_total ${metrics.conversion_failure_total}`)
  }

  // Conversion by format pair
  if (metrics.conversion_by_format_pair) {
    lines.push(`# HELP conversion_by_format_pair_total Conversions by format pair`)
    lines.push(`# TYPE conversion_by_format_pair_total counter`)
    for (const [pair, counts] of Object.entries(metrics.conversion_by_format_pair)) {
      const [from, to] = pair.split('→')
      lines.push(`conversion_by_format_pair_total{from_format="${from}",to_format="${to}",status="success"} ${counts.success}`)
      lines.push(`conversion_by_format_pair_total{from_format="${from}",to_format="${to}",status="failure"} ${counts.failure}`)
    }
  }

  // Conversion duration histogram
  if (metrics.conversion_duration_seconds) {
    lines.push(`# HELP conversion_duration_seconds Conversion duration in seconds`)
    lines.push(`# TYPE conversion_duration_seconds histogram`)
    for (const [pair, durations] of Object.entries(metrics.conversion_duration_seconds)) {
      if (durations.length > 0) {
        const [from, to] = pair.split('→')
        const sorted = durations.sort((a, b) => a - b)
        const p50 = sorted[Math.floor(sorted.length * 0.5)]
        const p95 = sorted[Math.floor(sorted.length * 0.95)]
        const p99 = sorted[Math.floor(sorted.length * 0.99)]
        const sum = durations.reduce((a, b) => a + b, 0)
        const count = durations.length
        
        lines.push(`conversion_duration_seconds{from_format="${from}",to_format="${to}",quantile="0.5"} ${p50}`)
        lines.push(`conversion_duration_seconds{from_format="${from}",to_format="${to}",quantile="0.95"} ${p95}`)
        lines.push(`conversion_duration_seconds{from_format="${from}",to_format="${to}",quantile="0.99"} ${p99}`)
        lines.push(`conversion_duration_seconds_sum{from_format="${from}",to_format="${to}"} ${sum}`)
        lines.push(`conversion_duration_seconds_count{from_format="${from}",to_format="${to}"} ${count}`)
      }
    }
  }

  // Validation rejections
  if (metrics.validation_file_size_rejections !== undefined) {
    lines.push(`# HELP validation_file_size_rejections_total File size validation rejections`)
    lines.push(`# TYPE validation_file_size_rejections_total counter`)
    lines.push(`validation_file_size_rejections_total ${metrics.validation_file_size_rejections}`)
  }

  if (metrics.validation_magic_bytes_rejections !== undefined) {
    lines.push(`# HELP validation_magic_bytes_rejections_total Magic bytes validation rejections`)
    lines.push(`# TYPE validation_magic_bytes_rejections_total counter`)
    lines.push(`validation_magic_bytes_rejections_total ${metrics.validation_magic_bytes_rejections}`)
  }

  if (metrics.validation_unsupported_rejections !== undefined) {
    lines.push(`# HELP validation_unsupported_rejections_total Unsupported conversion rejections`)
    lines.push(`# TYPE validation_unsupported_rejections_total counter`)
    lines.push(`validation_unsupported_rejections_total ${metrics.validation_unsupported_rejections}`)
  }

  // Queue metrics
  if (metrics.queue_depth !== undefined) {
    lines.push(`# HELP queue_depth Current queue depth (waiting + active)`)
    lines.push(`# TYPE queue_depth gauge`)
    lines.push(`queue_depth ${metrics.queue_depth}`)
  }

  if (metrics.queue_waiting !== undefined) {
    lines.push(`# HELP queue_waiting Jobs waiting in queue`)
    lines.push(`# TYPE queue_waiting gauge`)
    lines.push(`queue_waiting ${metrics.queue_waiting}`)
  }

  if (metrics.queue_active !== undefined) {
    lines.push(`# HELP queue_active Jobs currently being processed`)
    lines.push(`# TYPE queue_active gauge`)
    lines.push(`queue_active ${metrics.queue_active}`)
  }

  if (metrics.worker_utilization !== undefined) {
    lines.push(`# HELP worker_utilization_percent Worker utilization percentage`)
    lines.push(`# TYPE worker_utilization_percent gauge`)
    lines.push(`worker_utilization_percent ${metrics.worker_utilization}`)
  }

  // Error metrics
  if (metrics.api_errors_4xx !== undefined) {
    lines.push(`# HELP api_errors_4xx_total 4xx API errors`)
    lines.push(`# TYPE api_errors_4xx_total counter`)
    lines.push(`api_errors_4xx_total ${metrics.api_errors_4xx}`)
  }

  if (metrics.api_errors_5xx !== undefined) {
    lines.push(`# HELP api_errors_5xx_total 5xx API errors`)
    lines.push(`# TYPE api_errors_5xx_total counter`)
    lines.push(`api_errors_5xx_total ${metrics.api_errors_5xx}`)
  }

  if (metrics.worker_crashes !== undefined) {
    lines.push(`# HELP worker_crashes_total Worker crashes`)
    lines.push(`# TYPE worker_crashes_total counter`)
    lines.push(`worker_crashes_total ${metrics.worker_crashes}`)
  }

  // Tier usage
  if (metrics.tier_usage) {
    lines.push(`# HELP tier_usage_total Conversions by tier`)
    lines.push(`# TYPE tier_usage_total counter`)
    for (const [tier, stats] of Object.entries(metrics.tier_usage)) {
      lines.push(`tier_usage_total{tier="${tier}",type="conversions"} ${stats.conversions}`)
      lines.push(`tier_usage_total{tier="${tier}",type="rejections"} ${stats.rejections}`)
    }
  }

  // Security metrics
  if (metrics.auth_failures !== undefined) {
    lines.push(`# HELP auth_failures_total Authentication failures`)
    lines.push(`# TYPE auth_failures_total counter`)
    lines.push(`auth_failures_total ${metrics.auth_failures}`)
  }

  if (metrics.rate_limit_hits !== undefined) {
    lines.push(`# HELP rate_limit_hits_total Rate limit hits`)
    lines.push(`# TYPE rate_limit_hits_total counter`)
    lines.push(`rate_limit_hits_total ${metrics.rate_limit_hits}`)
  }

  if (metrics.suspicious_validation_failures !== undefined) {
    lines.push(`# HELP suspicious_validation_failures_total Suspicious validation failures`)
    lines.push(`# TYPE suspicious_validation_failures_total counter`)
    lines.push(`suspicious_validation_failures_total ${metrics.suspicious_validation_failures}`)
  }

  return lines.join('\n') + '\n'
}

