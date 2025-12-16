// Conversion Rules Matrix
// Defines all 357+ valid conversion paths between 117 file formats
// This file controls which conversions are supported

// Import dynamically to avoid circular dependency
let getFormatInfo: ((id: string) => any) | null = null
let FILE_FORMATS: any[] = []

// Lazy load formats to avoid circular dependency
async function loadFormats() {
  if (!getFormatInfo) {
    const formatsModule = await import('./formats')
    getFormatInfo = formatsModule.getFormatInfo
    FILE_FORMATS = formatsModule.FILE_FORMATS
  }
  return { getFormatInfo, FILE_FORMATS }
}

export type ConversionComplexity = 1 | 2 | 3 | 4
// 1 = Simple (direct conversion, fast)
// 2 = Moderate (requires processing, medium time)
// 3 = Complex (multiple steps, longer time)
// 4 = Very Complex (specialized tools, longest time)

export interface ConversionRule {
  sourceFormat: string
  targetFormat: string
  complexity: ConversionComplexity
  supported: boolean
  notes?: string
}

// Core conversion groups
const DOCUMENT_FORMATS = [
  'pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'html', 'htm', 'xhtml', 'mhtml', 'mht', 'md',
  'docm', 'dot', 'dotx', 'dotm',
  'json', 'xml', 'yaml', 'yml',
  'eml', 'msg',
  'ics', 'vcs', 'vcf',
  'epub', 'mobi', 'prc',
  'one', 'chm', 'tex', 'xmind', 'pst', 'sdf', 'ini',
  'bas', 'asm', 'cbl', 'vbp', 'pas', 'apa', 'bet', 'asc'
]

const SPREADSHEET_FORMATS = [
  'xlsx', 'xls', 'csv', 'ods', 'tsv',
  'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm',
  'wps', 'ott', 'wks', 'wk3', 'numbers', 'sylk', 'dif'
]

const PRESENTATION_FORMATS = [
  'pptx', 'ppt', 'odp', 'pptm', 'pps', 'ppsx', 'key'
]

const IMAGE_FORMATS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif',
  'heic', 'heif', 'avif', 'flif',
  'pcx', 'rle', 'dib', 'wbmp', 'pcd', 'pgm', 'pict', 'tga', 'xcf', 'yuv', 'hdr',
  'ico', 'cur', 'ani',
  'svg', 'svgz', 'eps', 'emf', 'wmf',
  'raw', 'dng', 'nef', 'orf', 'pef', 'raf', 'cr2', 'crw', 'arw', 'sfw', 'kdc',
  'psd', 'ai', 'cdr', 'cmx', 'djvu', 'jp2', 'jpx', 'fpx'
]

// Universal formats that can be converted from/to many formats
const UNIVERSAL_FORMATS = ['pdf', 'txt', 'html', 'png', 'jpg', 'jpeg']

/**
 * Check if a conversion is supported (synchronous version using IDs)
 */
export function isConversionSupported(sourceFormatId: string, targetFormatId: string): boolean {
  // Same format - not a conversion
  if (sourceFormatId === targetFormatId) return false

  // Get supported target IDs for source format
  const supportedTargetIds = getSupportedTargetIds(sourceFormatId)
  return supportedTargetIds.includes(targetFormatId)
}

/**
 * Get all supported target formats for a source format
 */
export async function getSupportedTargetFormats(sourceFormatId: string): Promise<any[]> {
  const { getFormatInfo: getFormatInfoFn } = await loadFormats()
  const sourceFormat = getFormatInfoFn(sourceFormatId)
  if (!sourceFormat) return []

  const supportedTargetIds = getSupportedTargetIds(sourceFormatId)
  return supportedTargetIds
    .map(id => getFormatInfoFn(id))
    .filter((f) => f !== undefined)
}

/**
 * Synchronous version that returns format IDs only (for performance)
 */
export function getSupportedTargetFormatIds(sourceFormatId: string): string[] {
  return getSupportedTargetIds(sourceFormatId)
}

/**
 * Get supported target format IDs for a source format
 * This is the core logic that defines all conversion paths
 */
function getSupportedTargetIds(sourceFormatId: string): string[] {
  const targets: string[] = []

  // Programming formats (Phase 7) - all convert to TXT only
  const programmingFormats = ['bas', 'asm', 'cbl', 'vbp', 'pas', 'apa', 'bet', 'asc']
  if (programmingFormats.includes(sourceFormatId)) {
    return ['txt']
  }

  // Document conversions
  if (DOCUMENT_FORMATS.includes(sourceFormatId)) {
    // Documents can convert to other documents
    targets.push(...DOCUMENT_FORMATS.filter(id => id !== sourceFormatId))
    
    // Documents can convert to PDF (universal)
    if (sourceFormatId !== 'pdf') {
      targets.push('pdf')
    }
    
    // Documents can convert to images (for preview/export)
    if (sourceFormatId === 'pdf' || sourceFormatId === 'html' || sourceFormatId === 'htm' || sourceFormatId === 'xhtml') {
      targets.push('png', 'jpg', 'jpeg')
    }
    
    // HTML variants can convert to each other
    if (['html', 'htm', 'xhtml', 'mhtml', 'mht'].includes(sourceFormatId)) {
      targets.push('html', 'htm', 'xhtml', 'mhtml', 'mht')
    }
    
    // YAML variants
    if (['yaml', 'yml'].includes(sourceFormatId)) {
      targets.push('yaml', 'yml', 'json', 'xml')
    }
    
    // JSON/XML can convert to each other and data formats
    if (sourceFormatId === 'json') {
      targets.push('xml', 'yaml', 'yml', 'csv', 'txt')
    }
    if (sourceFormatId === 'xml') {
      targets.push('json', 'yaml', 'yml', 'csv', 'txt')
    }
    
    // Email formats
    if (['eml', 'msg'].includes(sourceFormatId)) {
      targets.push('eml', 'msg', 'pdf', 'docx', 'txt')
    }
    
    // Calendar formats
    if (['ics', 'vcs'].includes(sourceFormatId)) {
      targets.push('ics', 'vcs', 'csv', 'json')
    }
    if (sourceFormatId === 'vcf') {
      targets.push('csv', 'json', 'txt')
    }
    
    // eBook formats
    if (['epub', 'mobi', 'prc'].includes(sourceFormatId)) {
      targets.push('epub', 'mobi', 'prc', 'pdf', 'txt')
    }
  }

  // Spreadsheet conversions
  if (SPREADSHEET_FORMATS.includes(sourceFormatId)) {
    // Spreadsheets can convert to other spreadsheets
    targets.push(...SPREADSHEET_FORMATS.filter(id => id !== sourceFormatId))
    
    // Spreadsheets can convert to PDF
    targets.push('pdf')
    
    // Spreadsheets can convert to CSV/TSV
    if (sourceFormatId !== 'csv' && sourceFormatId !== 'tsv') {
      targets.push('csv', 'tsv')
    }
    
    // CSV/TSV can convert to each other
    if (sourceFormatId === 'csv') {
      targets.push('tsv')
    }
    if (sourceFormatId === 'tsv') {
      targets.push('csv')
    }
    
    // Spreadsheets can convert to JSON/XML
    targets.push('json', 'xml')
    
    // Excel variants can convert to each other
    const excelFormats = ['xlsx', 'xls', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm']
    if (excelFormats.includes(sourceFormatId)) {
      targets.push(...excelFormats.filter(id => id !== sourceFormatId))
    }
  }

  // Presentation conversions
  if (PRESENTATION_FORMATS.includes(sourceFormatId)) {
    // Presentations can convert to other presentations
    targets.push(...PRESENTATION_FORMATS.filter(id => id !== sourceFormatId))
    
    // Presentations can convert to PDF
    targets.push('pdf')
    
    // Presentations can convert to images (slide export)
    targets.push('png', 'jpg', 'jpeg')
    
    // PowerPoint variants can convert to each other
    const pptFormats = ['pptx', 'ppt', 'pptm', 'pps', 'ppsx']
    if (pptFormats.includes(sourceFormatId)) {
      targets.push(...pptFormats.filter(id => id !== sourceFormatId))
    }
  }

  // Image conversions
  if (IMAGE_FORMATS.includes(sourceFormatId)) {
    // Core images can convert to other core images
    const coreImages = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif']
    if (coreImages.includes(sourceFormatId)) {
      targets.push(...coreImages.filter(id => id !== sourceFormatId))
    }
    
    // All images can convert to core formats
    targets.push('jpg', 'jpeg', 'png', 'bmp', 'gif', 'webp', 'tiff', 'tif')
    
    // Modern formats
    if (['heic', 'heif'].includes(sourceFormatId)) {
      targets.push('heic', 'heif', 'jpg', 'jpeg', 'png', 'tiff', 'tif')
    }
    if (sourceFormatId === 'avif') {
      targets.push('jpg', 'jpeg', 'png', 'webp', 'tiff', 'tif')
    }
    if (sourceFormatId === 'flif') {
      targets.push('png', 'jpg', 'jpeg', 'tiff', 'tif')
    }
    
    // Legacy formats
    const legacyImages = ['pcx', 'rle', 'dib', 'wbmp', 'pcd', 'pgm', 'pict', 'tga', 'xcf', 'yuv', 'hdr']
    if (legacyImages.includes(sourceFormatId)) {
      targets.push('jpg', 'jpeg', 'png', 'bmp', 'tiff', 'tif')
    }
    
    // Icons
    if (['ico', 'cur', 'ani'].includes(sourceFormatId)) {
      targets.push('ico', 'cur', 'png', 'jpg', 'jpeg', 'bmp')
    }
    
    // Vector formats
    if (['svg', 'svgz'].includes(sourceFormatId)) {
      targets.push('svg', 'svgz', 'png', 'jpg', 'jpeg', 'pdf', 'eps')
    }
    if (sourceFormatId === 'eps') {
      targets.push('pdf', 'svg', 'png', 'jpg', 'jpeg', 'tiff', 'tif')
    }
    if (['emf', 'wmf'].includes(sourceFormatId)) {
      targets.push('png', 'jpg', 'jpeg', 'svg', 'pdf')
    }
    
    // RAW formats - convert to standard images
    const rawFormats = ['raw', 'dng', 'nef', 'orf', 'pef', 'raf', 'cr2', 'crw', 'arw', 'sfw', 'kdc']
    if (rawFormats.includes(sourceFormatId)) {
      targets.push('jpg', 'jpeg', 'png', 'tiff', 'tif', 'dng')
    }
    
    // Professional formats
    if (sourceFormatId === 'psd') {
      targets.push('png', 'jpg', 'jpeg', 'tiff', 'tif', 'pdf', 'bmp')
    }
    if (sourceFormatId === 'ai') {
      targets.push('pdf', 'svg', 'png', 'jpg', 'jpeg', 'eps')
    }
    if (['cdr', 'cmx'].includes(sourceFormatId)) {
      targets.push('png', 'jpg', 'jpeg', 'svg', 'pdf', 'eps')
    }
    if (sourceFormatId === 'djvu') {
      targets.push('pdf', 'png', 'jpg', 'jpeg')
    }
    if (['jp2', 'jpx'].includes(sourceFormatId)) {
      targets.push('jpg', 'jpeg', 'png', 'tiff', 'tif')
    }
    if (sourceFormatId === 'fpx') {
      targets.push('jpg', 'jpeg', 'png', 'tiff', 'tif')
    }
    
    // Images can convert to PDF (for documents)
    targets.push('pdf')
  }

  // PDF is universal - can convert to many formats
  if (sourceFormatId === 'pdf') {
    targets.push(
      // Documents
      'docx', 'doc', 'txt', 'rtf', 'odt', 'html', 'htm',
      // Images
      'png', 'jpg', 'jpeg', 'tiff', 'tif',
      // Spreadsheets (if PDF contains tables)
      'xlsx', 'csv',
      // Presentations (if PDF contains slides)
      'pptx'
    )
  }

  // Remove duplicates and source format
  return Array.from(new Set(targets)).filter(id => id !== sourceFormatId)
}

/**
 * Get conversion complexity level (works with format IDs only, no imports needed)
 */
export function getConversionComplexity(sourceFormatId: string, targetFormatId: string): ConversionComplexity {
  if (!isConversionSupported(sourceFormatId, targetFormatId)) {
    return 4 // Unsupported
  }

  // RAW and professional formats are complex - check FIRST before category checks
  const complexFormats = ['raw', 'dng', 'nef', 'orf', 'pef', 'raf', 'cr2', 'crw', 'arw', 'sfw', 'kdc', 
                          'psd', 'ai', 'cdr', 'cmx', 'djvu', 'jp2', 'jpx', 'fpx',
                          'epub', 'mobi', 'prc', 'one', 'chm', 'xmind']
  if (complexFormats.includes(sourceFormatId) || complexFormats.includes(targetFormatId)) {
    // Very complex formats (RAW, PSD) that require specialized tools
    const veryComplexFormats = ['raw', 'dng', 'nef', 'orf', 'pef', 'raf', 'cr2', 'crw', 'arw', 'sfw', 'kdc', 'psd']
    if (veryComplexFormats.includes(sourceFormatId) || veryComplexFormats.includes(targetFormatId)) {
      return 4 // Very complex - requires specialized CLI tools
    }
    return 3 // Complex - requires specialized libraries
  }

  // Determine category from format ID lists
  const sourceIsDocument = DOCUMENT_FORMATS.includes(sourceFormatId)
  const sourceIsSpreadsheet = SPREADSHEET_FORMATS.includes(sourceFormatId)
  const sourceIsPresentation = PRESENTATION_FORMATS.includes(sourceFormatId)
  const sourceIsImage = IMAGE_FORMATS.includes(sourceFormatId)
  
  const targetIsDocument = DOCUMENT_FORMATS.includes(targetFormatId)
  const targetIsSpreadsheet = SPREADSHEET_FORMATS.includes(targetFormatId)
  const targetIsPresentation = PRESENTATION_FORMATS.includes(targetFormatId)
  const targetIsImage = IMAGE_FORMATS.includes(targetFormatId)

  // Same category conversions are usually simpler
  if ((sourceIsDocument && targetIsDocument) ||
      (sourceIsSpreadsheet && targetIsSpreadsheet) ||
      (sourceIsPresentation && targetIsPresentation) ||
      (sourceIsImage && targetIsImage)) {
    // Simple conversions within same category
    if (
      (sourceIsImage && ['jpg', 'jpeg', 'png', 'bmp', 'gif'].includes(sourceFormatId) && 
       ['jpg', 'jpeg', 'png', 'bmp', 'gif'].includes(targetFormatId)) ||
      (sourceIsDocument && ['txt', 'html', 'htm'].includes(sourceFormatId) && 
       ['txt', 'html', 'htm'].includes(targetFormatId)) ||
      (sourceIsSpreadsheet && ['csv', 'tsv'].includes(sourceFormatId) && 
       ['csv', 'tsv'].includes(targetFormatId))
    ) {
      return 1
    }
    return 2
  }

  // Cross-category conversions
  // PDF conversions are usually moderate
  if (sourceFormatId === 'pdf' || targetFormatId === 'pdf') {
    return 2
  }

  // Default moderate complexity
  return 2
}

/**
 * Get total number of supported conversions (async version)
 */
export async function getTotalConversionCount(): Promise<number> {
  const { FILE_FORMATS: formats } = await loadFormats()
  let count = 0
  for (const source of formats) {
    const targets = await getSupportedTargetFormats(source.id)
    count += targets.length
  }
  return count
}

/**
 * Synchronous version using IDs only
 */
export function getTotalConversionCountSync(): number {
  // This is an approximation - for exact count use async version
  // Returns estimated count based on format categories
  const documentCount = 43
  const spreadsheetCount = 17
  const presentationCount = 7
  const imageCount = 50
  
  // Rough estimate: each format can convert to ~3-4 other formats on average
  return (documentCount + spreadsheetCount + presentationCount + imageCount) * 3
}
