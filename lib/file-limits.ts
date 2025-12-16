/**
 * File size limits configuration
 * Centralized source of truth for tier-based file size limits
 */

export type UserTier = 'free' | 'starter' | 'professional' | 'enterprise'

/**
 * Get maximum file size in bytes for a user tier
 */
export function getMaxFileSize(tier: UserTier = 'free'): number {
  const limits: Record<UserTier, number> = {
    free: 100 * 1024 * 1024, // 100MB
    starter: 500 * 1024 * 1024, // 500MB
    professional: 2 * 1024 * 1024 * 1024, // 2GB
    enterprise: 10 * 1024 * 1024 * 1024, // 10GB (practical limit, though UI shows "Unlimited")
  }

  return limits[tier]
}

/**
 * Format file size limit for display
 */
export function formatFileSizeLimit(tier: UserTier = 'free'): string {
  const maxSize = getMaxFileSize(tier)
  
  if (tier === 'enterprise') {
    return 'Unlimited' // Marketing display, though actual limit is 10GB
  }

  if (maxSize < 1024 * 1024) {
    return `${maxSize / 1024}KB`
  } else if (maxSize < 1024 * 1024 * 1024) {
    return `${maxSize / (1024 * 1024)}MB`
  } else {
    return `${maxSize / (1024 * 1024 * 1024)}GB`
  }
}

/**
 * Validate file size against tier limit
 */
export function validateFileSize(fileSize: number, tier: UserTier = 'free'): {
  valid: boolean
  error?: string
} {
  const maxSize = getMaxFileSize(tier)
  
  if (fileSize > maxSize) {
    return {
      valid: false,
      error: `File size (${formatFileSize(fileSize)}) exceeds the ${tier} tier limit of ${formatFileSizeLimit(tier)}. Please upgrade your plan or reduce file size.`,
    }
  }

  return { valid: true }
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

