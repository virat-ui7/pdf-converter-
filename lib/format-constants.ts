/**
 * Format Count Constants
 * SINGLE SOURCE OF TRUTH for format counts
 * All user-facing copy should derive from these constants
 */

import { FILE_FORMATS, getFormatsByCategory, FormatCategory } from './formats'

/**
 * Get total format count
 */
export function getTotalFormatCount(): number {
  return FILE_FORMATS.length
}

/**
 * Get format count by category
 */
export function getFormatCountByCategory(category: FormatCategory): number {
  return getFormatsByCategory(category).length
}

/**
 * Format count constants (computed from registry)
 * These are the actual counts - use these for display
 */
export const FORMAT_COUNTS = {
  total: getTotalFormatCount(),
  documents: getFormatCountByCategory('document'),
  spreadsheets: getFormatCountByCategory('spreadsheet'),
  presentations: getFormatCountByCategory('presentation'),
  images: getFormatCountByCategory('image'),
} as const

/**
 * Format count display strings
 */
export const FORMAT_COUNT_DISPLAY = {
  total: `${FORMAT_COUNTS.total} formats`,
  totalWithPlus: `${FORMAT_COUNTS.total}+ formats`,
  documents: `${FORMAT_COUNTS.documents} document formats`,
  spreadsheets: `${FORMAT_COUNTS.spreadsheets} spreadsheet formats`,
  presentations: `${FORMAT_COUNTS.presentations} presentation formats`,
  images: `${FORMAT_COUNTS.images} image formats`,
  breakdown: `${FORMAT_COUNTS.documents} documents, ${FORMAT_COUNTS.spreadsheets} spreadsheets, ${FORMAT_COUNTS.presentations} presentations, ${FORMAT_COUNTS.images} images`,
} as const

