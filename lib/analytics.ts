import { supabase } from './supabase'

/**
 * Track analytics events
 */
export interface AnalyticsEvent {
  event_type: string
  user_id?: string | null
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
}

/**
 * Log analytics event to database
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    await supabase.from('analytics').insert({
      event_type: event.event_type,
      user_id: event.user_id || null,
      metadata: event.metadata || {},
      ip_address: event.ip_address,
      user_agent: event.user_agent,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Track conversion event
 */
export async function trackConversion(
  conversionId: string,
  userId: string | null,
  sourceFormat: string,
  targetFormat: string,
  fileSize: number
): Promise<void> {
  await trackEvent({
    event_type: 'conversion.completed',
    user_id: userId,
    metadata: {
      conversion_id: conversionId,
      source_format: sourceFormat,
      target_format: targetFormat,
      file_size: fileSize,
    },
  })
}

/**
 * Track page view
 */
export async function trackPageView(
  page: string,
  userId?: string | null
): Promise<void> {
  await trackEvent({
    event_type: 'page.view',
    user_id: userId,
    metadata: {
      page,
    },
  })
}

/**
 * Track signup
 */
export async function trackSignup(userId: string, method: string): Promise<void> {
  await trackEvent({
    event_type: 'user.signup',
    user_id: userId,
    metadata: {
      method, // 'email', 'google', 'github'
    },
  })
}

/**
 * Track subscription
 */
export async function trackSubscription(
  userId: string,
  plan: string,
  amount: number
): Promise<void> {
  await trackEvent({
    event_type: 'subscription.created',
    user_id: userId,
    metadata: {
      plan,
      amount,
    },
  })
}

