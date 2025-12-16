import { FILE_FORMATS, type FileFormat, type FormatCategory, getFormatInfo } from './formats'
import { getSupportedTargetFormatIds, isConversionSupported } from './conversion-rules'

export interface ConversionPath {
  source: FileFormat
  target: FileFormat
  path: string // e.g., "PDF → Word"
}

export interface ConversionPossibilities {
  sourceFormat: FileFormat
  targetFormats: FileFormat[]
  byCategory: Record<FormatCategory, FileFormat[]>
  totalCount: number
}

/**
 * Get all possible target formats for a given source format
 * Uses conversion rules to return only supported conversions
 */
export function getConversionPossibilities(sourceFormatId: string): ConversionPossibilities | null {
  const sourceFormat = getFormatInfo(sourceFormatId)
  if (!sourceFormat) return null

  // Get supported target formats from conversion rules
  const targetIds = getSupportedTargetFormatIds(sourceFormatId)
  const targetFormats = targetIds
    .map(id => getFormatInfo(id))
    .filter((f): f is FileFormat => f !== undefined)

  // Group by category
  const byCategory: Record<FormatCategory, FileFormat[]> = {
    document: [],
    image: [],
    spreadsheet: [],
    presentation: [],
  }

  targetFormats.forEach((format) => {
    byCategory[format.category].push(format)
  })

  return {
    sourceFormat,
    targetFormats,
    byCategory,
    totalCount: targetFormats.length,
  }
}

/**
 * Get all conversion paths grouped by category
 * Uses conversion rules to return only supported conversions
 */
export function getAllConversionsByCategory(): Record<FormatCategory, ConversionPath[]> {
  const result: Record<FormatCategory, ConversionPath[]> = {
    document: [],
    image: [],
    spreadsheet: [],
    presentation: [],
  }

  FILE_FORMATS.forEach((source) => {
    FILE_FORMATS.forEach((target) => {
      if (source.id !== target.id && isConversionSupported(source.id, target.id)) {
        result[source.category].push({
          source,
          target,
          path: formatConversionPath(source.name, target.name),
        })
      }
    })
  })

  return result
}

/**
 * Format a conversion path string (e.g., "PDF → Word")
 */
export function formatConversionPath(source: string, target: string): string {
  return `${source} → ${target}`
}

/**
 * Get all conversion possibilities for all formats
 */
export function getAllConversionPossibilities(): Map<string, ConversionPossibilities> {
  const result = new Map<string, ConversionPossibilities>()

  FILE_FORMATS.forEach((format) => {
    const possibilities = getConversionPossibilities(format.id)
    if (possibilities) {
      result.set(format.id, possibilities)
    }
  })

  return result
}

/**
 * Get conversion count for a format
 * Uses conversion rules to return accurate count
 */
export function getConversionCount(formatId: string): number {
  const targetIds = getSupportedTargetFormatIds(formatId)
  return targetIds.length
}

/**
 * Search formats by name or extension
 */
export function searchFormats(query: string): FileFormat[] {
  const lowerQuery = query.toLowerCase()
  return FILE_FORMATS.filter(
    (format) =>
      format.name.toLowerCase().includes(lowerQuery) ||
      format.extension.toLowerCase().includes(lowerQuery) ||
      format.id.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get formats by category with conversion counts
 */
export function getFormatsWithConversionCounts(): Array<FileFormat & { conversionCount: number }> {
  return FILE_FORMATS.map((format) => ({
    ...format,
    conversionCount: getConversionCount(format.id),
  }))
}

