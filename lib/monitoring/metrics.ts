/**
 * Monitoring Metrics Definitions
 * 
 * This file defines all metrics to be tracked for monitoring and alerting.
 * Metrics are exported in Prometheus format for compatibility with monitoring tools.
 */

/**
 * Metric types
 */
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary'

/**
 * Base metric interface
 */
export interface Metric {
  name: string
  type: MetricType
  description: string
  labels?: string[]
}

/**
 * Conversion Metrics
 */
export const CONVERSION_METRICS = {
  // Total conversions attempted
  conversion_total: {
    name: 'conversion_total',
    type: 'counter' as MetricType,
    description: 'Total number of conversion attempts',
    labels: ['from_format', 'to_format', 'tier', 'status'], // status: success, failed, rejected
  },
  
  // Conversion success rate
  conversion_success_rate: {
    name: 'conversion_success_rate',
    type: 'gauge' as MetricType,
    description: 'Conversion success rate per format pair (0-1)',
    labels: ['from_format', 'to_format'],
  },
  
  // Conversion duration
  conversion_duration_seconds: {
    name: 'conversion_duration_seconds',
    type: 'histogram' as MetricType,
    description: 'Time taken to complete conversion',
    labels: ['from_format', 'to_format', 'tier'],
    buckets: [1, 5, 10, 30, 60, 120, 300], // seconds
  },
  
  // Conversion file sizes
  conversion_file_size_bytes: {
    name: 'conversion_file_size_bytes',
    type: 'histogram' as MetricType,
    description: 'File sizes being converted',
    labels: ['from_format', 'to_format'],
    buckets: [1024, 10240, 102400, 1048576, 10485760, 104857600, 1073741824], // 1KB to 1GB
  },
} as const

/**
 * Validation Metrics
 */
export const VALIDATION_METRICS = {
  // File size rejections
  validation_rejection_total: {
    name: 'validation_rejection_total',
    type: 'counter' as MetricType,
    description: 'Total validation rejections',
    labels: ['rejection_type', 'tier'], // rejection_type: file_size, magic_bytes, unsupported, empty
  },
  
  // Validation rejection rate
  validation_rejection_rate: {
    name: 'validation_rejection_rate',
    type: 'gauge' as MetricType,
    description: 'Validation rejection rate (0-1)',
    labels: ['rejection_type'],
  },
  
  // Magic bytes validation failures
  magic_bytes_mismatch_total: {
    name: 'magic_bytes_mismatch_total',
    type: 'counter' as MetricType,
    description: 'Files with magic bytes mismatch',
    labels: ['declared_format', 'detected_format'],
  },
} as const

/**
 * Performance Metrics
 */
export const PERFORMANCE_METRICS = {
  // API response time
  api_request_duration_seconds: {
    name: 'api_request_duration_seconds',
    type: 'histogram' as MetricType,
    description: 'API request duration',
    labels: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
  },
  
  // Queue depth
  queue_depth: {
    name: 'queue_depth',
    type: 'gauge' as MetricType,
    description: 'Number of jobs waiting in queue',
    labels: ['queue_name'],
  },
  
  // Worker utilization
  worker_utilization: {
    name: 'worker_utilization',
    type: 'gauge' as MetricType,
    description: 'Percentage of workers currently processing (0-1)',
    labels: [],
  },
  
  // Active workers
  workers_active: {
    name: 'workers_active',
    type: 'gauge' as MetricType,
    description: 'Number of active workers',
    labels: [],
  },
  
  // Worker job processing time
  worker_job_duration_seconds: {
    name: 'worker_job_duration_seconds',
    type: 'histogram' as MetricType,
    description: 'Time taken to process a job in worker',
    labels: ['job_type', 'status'],
    buckets: [1, 5, 10, 30, 60, 120, 300],
  },
} as const

/**
 * Error Metrics
 */
export const ERROR_METRICS = {
  // HTTP errors
  http_errors_total: {
    name: 'http_errors_total',
    type: 'counter' as MetricType,
    description: 'Total HTTP errors',
    labels: ['status_code', 'route', 'error_type'], // error_type: 4xx, 5xx
  },
  
  // Worker crashes
  worker_crashes_total: {
    name: 'worker_crashes_total',
    type: 'counter' as MetricType,
    description: 'Total worker crashes',
    labels: ['error_type'],
  },
  
  // Conversion failures
  conversion_failures_total: {
    name: 'conversion_failures_total',
    type: 'counter' as MetricType,
    description: 'Total conversion failures',
    labels: ['from_format', 'to_format', 'failure_reason'],
  },
  
  // Timeout errors
  timeout_errors_total: {
    name: 'timeout_errors_total',
    type: 'counter' as MetricType,
    description: 'Total timeout errors',
    labels: ['timeout_type'], // timeout_type: api, worker, conversion
  },
} as const

/**
 * Tier Usage Metrics
 */
export const TIER_METRICS = {
  // Conversions per tier
  tier_conversions_total: {
    name: 'tier_conversions_total',
    type: 'counter' as MetricType,
    description: 'Total conversions per tier',
    labels: ['tier'],
  },
  
  // Tier limit hits
  tier_limit_hits_total: {
    name: 'tier_limit_hits_total',
    type: 'counter' as MetricType,
    description: 'Times tier limits were hit',
    labels: ['tier', 'limit_type'], // limit_type: conversions, file_size
  },
  
  // File size limit rejections by tier
  tier_file_size_rejections_total: {
    name: 'tier_file_size_rejections_total',
    type: 'counter' as MetricType,
    description: 'File size rejections per tier',
    labels: ['tier', 'file_size_mb'],
  },
} as const

/**
 * Security Metrics
 */
export const SECURITY_METRICS = {
  // Failed authentication attempts
  auth_failures_total: {
    name: 'auth_failures_total',
    type: 'counter' as MetricType,
    description: 'Total failed authentication attempts',
    labels: ['auth_method', 'reason'], // auth_method: email, google, github
  },
  
  // Rate limiting hits
  rate_limit_hits_total: {
    name: 'rate_limit_hits_total',
    type: 'counter' as MetricType,
    description: 'Rate limit hits',
    labels: ['limit_type', 'identifier'], // limit_type: ip, user, api_key
  },
  
  // Suspicious file patterns
  suspicious_files_total: {
    name: 'suspicious_files_total',
    type: 'counter' as MetricType,
    description: 'Files flagged as suspicious',
    labels: ['reason'], // reason: magic_bytes_mismatch, unusual_size, etc.
  },
} as const

/**
 * System Metrics
 */
export const SYSTEM_METRICS = {
  // Database connections
  db_connections_active: {
    name: 'db_connections_active',
    type: 'gauge' as MetricType,
    description: 'Active database connections',
    labels: [],
  },
  
  // Database query duration
  db_query_duration_seconds: {
    name: 'db_query_duration_seconds',
    type: 'histogram' as MetricType,
    description: 'Database query duration',
    labels: ['query_type'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
  },
  
  // Storage usage
  storage_used_bytes: {
    name: 'storage_used_bytes',
    type: 'gauge' as MetricType,
    description: 'Storage space used',
    labels: ['bucket'],
  },
} as const

/**
 * All metrics combined
 */
export const ALL_METRICS = {
  ...CONVERSION_METRICS,
  ...VALIDATION_METRICS,
  ...PERFORMANCE_METRICS,
  ...ERROR_METRICS,
  ...TIER_METRICS,
  ...SECURITY_METRICS,
  ...SYSTEM_METRICS,
} as const

/**
 * Metric thresholds for alerting
 */
export const METRIC_THRESHOLDS = {
  // Conversion success rate
  conversion_success_rate_min: 0.95, // 95% minimum
  conversion_success_rate_alert: 0.90, // Alert if below 90%
  
  // Validation rejection rate
  validation_rejection_rate_max: 0.05, // 5% maximum acceptable
  validation_rejection_rate_alert: 0.15, // Alert if above 15%
  
  // Performance
  api_response_time_p95_max: 5000, // 5 seconds max P95
  api_response_time_p95_alert: 10000, // Alert if P95 > 10 seconds
  conversion_duration_p95_max: 30000, // 30 seconds max P95
  conversion_duration_p95_alert: 60000, // Alert if P95 > 60 seconds
  
  // Error rates
  http_4xx_rate_max: 0.10, // 10% max 4xx errors
  http_5xx_rate_max: 0.005, // 0.5% max 5xx errors
  http_5xx_rate_alert: 0.01, // Alert if 5xx > 1%
  
  // Queue depth
  queue_depth_max: 100, // Normal queue depth
  queue_depth_alert: 1000, // Alert if queue > 1000
  
  // Worker utilization
  worker_utilization_max: 0.80, // 80% max utilization
  worker_utilization_alert: 0.95, // Alert if > 95%
  
  // Security
  auth_failures_max_per_hour: 10, // Max failed auths per hour globally
  rate_limit_hits_max_per_minute: 100, // Max rate limit hits per minute
} as const

