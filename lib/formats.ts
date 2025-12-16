// Supported file formats database
// Total: 117 formats across 4 categories
// Breakdown: 43 documents, 17 spreadsheets, 7 presentations, 50 images

export type FormatCategory = 'document' | 'image' | 'spreadsheet' | 'presentation'

export interface FileFormat {
  id: string
  name: string
  extension: string
  category: FormatCategory
  mimeType: string
  icon: string
  description?: string
}

export const FILE_FORMATS: FileFormat[] = [
  // ============================================
  // DOCUMENTS (43 formats)
  // ============================================
  
  // Core Documents (Phase 1)
  { id: 'pdf', name: 'PDF', extension: 'pdf', category: 'document', mimeType: 'application/pdf', icon: '📄', description: 'Portable Document Format' },
  { id: 'docx', name: 'Word', extension: 'docx', category: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: '📝', description: 'Microsoft Word Document' },
  { id: 'doc', name: 'Word (Legacy)', extension: 'doc', category: 'document', mimeType: 'application/msword', icon: '📝', description: 'Microsoft Word 97-2003' },
  { id: 'txt', name: 'Text', extension: 'txt', category: 'document', mimeType: 'text/plain', icon: '📄', description: 'Plain Text File' },
  { id: 'rtf', name: 'Rich Text', extension: 'rtf', category: 'document', mimeType: 'application/rtf', icon: '📄', description: 'Rich Text Format' },
  { id: 'odt', name: 'OpenDocument Text', extension: 'odt', category: 'document', mimeType: 'application/vnd.oasis.opendocument.text', icon: '📄', description: 'OpenDocument Text Document' },
  { id: 'html', name: 'HTML', extension: 'html', category: 'document', mimeType: 'text/html', icon: '🌐', description: 'HyperText Markup Language' },
  
  // Extended Office Documents (Phase 2)
  { id: 'docm', name: 'Word Macro', extension: 'docm', category: 'document', mimeType: 'application/vnd.ms-word.document.macroEnabled.12', icon: '📝', description: 'Word Document with Macros' },
  { id: 'dot', name: 'Word Template', extension: 'dot', category: 'document', mimeType: 'application/msword', icon: '📝', description: 'Word Template' },
  { id: 'dotx', name: 'Word Template (XML)', extension: 'dotx', category: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', icon: '📝', description: 'Word Template XML' },
  { id: 'dotm', name: 'Word Template Macro', extension: 'dotm', category: 'document', mimeType: 'application/vnd.ms-word.template.macroEnabled.12', icon: '📝', description: 'Word Template with Macros' },
  
  // Web Formats (Phase 2)
  { id: 'htm', name: 'HTML', extension: 'htm', category: 'document', mimeType: 'text/html', icon: '🌐', description: 'HTML File' },
  { id: 'xhtml', name: 'XHTML', extension: 'xhtml', category: 'document', mimeType: 'application/xhtml+xml', icon: '🌐', description: 'Extensible HTML' },
  { id: 'mhtml', name: 'MHTML', extension: 'mhtml', category: 'document', mimeType: 'message/rfc822', icon: '🌐', description: 'MIME HTML' },
  { id: 'mht', name: 'MHT', extension: 'mht', category: 'document', mimeType: 'message/rfc822', icon: '🌐', description: 'MHTML Archive' },
  { id: 'md', name: 'Markdown', extension: 'md', category: 'document', mimeType: 'text/markdown', icon: '📝', description: 'Markdown Document' },
  
  // Data Formats (Phase 2)
  { id: 'json', name: 'JSON', extension: 'json', category: 'document', mimeType: 'application/json', icon: '📄', description: 'JavaScript Object Notation' },
  { id: 'xml', name: 'XML', extension: 'xml', category: 'document', mimeType: 'application/xml', icon: '📄', description: 'Extensible Markup Language' },
  { id: 'yaml', name: 'YAML', extension: 'yaml', category: 'document', mimeType: 'text/yaml', icon: '📄', description: 'YAML Ain\'t Markup Language' },
  { id: 'yml', name: 'YAML', extension: 'yml', category: 'document', mimeType: 'text/yaml', icon: '📄', description: 'YAML File' },
  
  // Email Formats (Phase 3)
  { id: 'eml', name: 'EML', extension: 'eml', category: 'document', mimeType: 'message/rfc822', icon: '📧', description: 'Email Message' },
  { id: 'msg', name: 'MSG', extension: 'msg', category: 'document', mimeType: 'application/vnd.ms-outlook', icon: '📧', description: 'Outlook Message' },
  
  // Calendar Formats (Phase 3)
  { id: 'ics', name: 'iCalendar', extension: 'ics', category: 'document', mimeType: 'text/calendar', icon: '📅', description: 'iCalendar Format' },
  { id: 'vcs', name: 'vCalendar', extension: 'vcs', category: 'document', mimeType: 'text/x-vcalendar', icon: '📅', description: 'vCalendar Format' },
  { id: 'vcf', name: 'vCard', extension: 'vcf', category: 'document', mimeType: 'text/vcard', icon: '👤', description: 'vCard Contact' },
  
  // eBook Formats (Phase 3)
  { id: 'epub', name: 'ePub', extension: 'epub', category: 'document', mimeType: 'application/epub+zip', icon: '📚', description: 'Electronic Publication' },
  { id: 'mobi', name: 'Mobi', extension: 'mobi', category: 'document', mimeType: 'application/x-mobipocket-ebook', icon: '📚', description: 'Mobipocket eBook' },
  { id: 'prc', name: 'PRC', extension: 'prc', category: 'document', mimeType: 'application/x-mobipocket-ebook', icon: '📚', description: 'Palm Resource Code' },
  
  // Specialized Documents (Phase 3)
  { id: 'one', name: 'OneNote', extension: 'one', category: 'document', mimeType: 'application/msonenote', icon: '📝', description: 'Microsoft OneNote' },
  { id: 'chm', name: 'CHM', extension: 'chm', category: 'document', mimeType: 'application/vnd.ms-htmlhelp', icon: '📚', description: 'Compiled HTML Help' },
  { id: 'tex', name: 'LaTeX', extension: 'tex', category: 'document', mimeType: 'application/x-tex', icon: '📄', description: 'LaTeX Document' },
  { id: 'xmind', name: 'XMind', extension: 'xmind', category: 'document', mimeType: 'application/xmind', icon: '🧠', description: 'XMind Mind Map' },
  { id: 'pst', name: 'PST', extension: 'pst', category: 'document', mimeType: 'application/vnd.ms-outlook', icon: '📧', description: 'Outlook Data File' },
  { id: 'sdf', name: 'SDF', extension: 'sdf', category: 'document', mimeType: 'application/x-sdf', icon: '📄', description: 'Structured Data File' },
  { id: 'ini', name: 'INI', extension: 'ini', category: 'document', mimeType: 'text/plain', icon: '⚙️', description: 'Initialization File' },
  
  // Programming Formats (Phase 7) - All convert to TXT
  { id: 'bas', name: 'BASIC', extension: 'bas', category: 'document', mimeType: 'text/plain', icon: '💻', description: 'BASIC Source Code' },
  { id: 'asm', name: 'Assembly', extension: 'asm', category: 'document', mimeType: 'text/plain', icon: '💻', description: 'Assembly Source Code' },
  { id: 'cbl', name: 'COBOL', extension: 'cbl', category: 'document', mimeType: 'text/plain', icon: '💻', description: 'COBOL Source Code' },
  { id: 'vbp', name: 'Visual Basic', extension: 'vbp', category: 'document', mimeType: 'text/plain', icon: '💻', description: 'Visual Basic Project' },
  { id: 'pas', name: 'Pascal', extension: 'pas', category: 'document', mimeType: 'text/plain', icon: '💻', description: 'Pascal Source Code' },
  { id: 'apa', name: 'APA', extension: 'apa', category: 'document', mimeType: 'text/plain', icon: '💻', description: 'APA Format' },
  { id: 'bet', name: 'BET', extension: 'bet', category: 'document', mimeType: 'text/plain', icon: '💻', description: 'BET Format' },
  { id: 'asc', name: 'ASCII', extension: 'asc', category: 'document', mimeType: 'text/plain', icon: '💻', description: 'ASCII Text' },
  
  // ============================================
  // SPREADSHEETS (17 formats)
  // ============================================
  
  // Core Spreadsheets (Phase 1)
  { id: 'xlsx', name: 'Excel', extension: 'xlsx', category: 'spreadsheet', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: '📊', description: 'Microsoft Excel Spreadsheet' },
  { id: 'xls', name: 'Excel (Legacy)', extension: 'xls', category: 'spreadsheet', mimeType: 'application/vnd.ms-excel', icon: '📊', description: 'Excel 97-2003' },
  { id: 'csv', name: 'CSV', extension: 'csv', category: 'spreadsheet', mimeType: 'text/csv', icon: '📊', description: 'Comma-Separated Values' },
  { id: 'ods', name: 'OpenDocument Spreadsheet', extension: 'ods', category: 'spreadsheet', mimeType: 'application/vnd.oasis.opendocument.spreadsheet', icon: '📊', description: 'OpenDocument Spreadsheet' },
  { id: 'tsv', name: 'TSV', extension: 'tsv', category: 'spreadsheet', mimeType: 'text/tab-separated-values', icon: '📊', description: 'Tab-Separated Values' },
  
  // Extended Office Spreadsheets (Phase 2)
  { id: 'xlsm', name: 'Excel Macro', extension: 'xlsm', category: 'spreadsheet', mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12', icon: '📊', description: 'Excel with Macros' },
  { id: 'xlsb', name: 'Excel Binary', extension: 'xlsb', category: 'spreadsheet', mimeType: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12', icon: '📊', description: 'Excel Binary Format' },
  { id: 'xlt', name: 'Excel Template', extension: 'xlt', category: 'spreadsheet', mimeType: 'application/vnd.ms-excel', icon: '📊', description: 'Excel Template' },
  { id: 'xltx', name: 'Excel Template (XML)', extension: 'xltx', category: 'spreadsheet', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template', icon: '📊', description: 'Excel Template XML' },
  { id: 'xltm', name: 'Excel Template Macro', extension: 'xltm', category: 'spreadsheet', mimeType: 'application/vnd.ms-excel.template.macroEnabled.12', icon: '📊', description: 'Excel Template with Macros' },
  
  // Legacy & Alternative Spreadsheets (Phase 8)
  { id: 'wps', name: 'WPS', extension: 'wps', category: 'spreadsheet', mimeType: 'application/vnd.ms-works', icon: '📊', description: 'WPS Spreadsheet' },
  { id: 'ott', name: 'OpenDocument Template', extension: 'ott', category: 'spreadsheet', mimeType: 'application/vnd.oasis.opendocument.spreadsheet-template', icon: '📊', description: 'ODS Template' },
  { id: 'wks', name: 'Works', extension: 'wks', category: 'spreadsheet', mimeType: 'application/vnd.ms-works', icon: '📊', description: 'Microsoft Works' },
  { id: 'wk3', name: 'Lotus 1-2-3', extension: 'wk3', category: 'spreadsheet', mimeType: 'application/vnd.lotus-1-2-3', icon: '📊', description: 'Lotus 1-2-3' },
  { id: 'numbers', name: 'Numbers', extension: 'numbers', category: 'spreadsheet', mimeType: 'application/vnd.apple.numbers', icon: '📊', description: 'Apple Numbers' },
  { id: 'sylk', name: 'SYLK', extension: 'sylk', category: 'spreadsheet', mimeType: 'text/plain', icon: '📊', description: 'Symbolic Link' },
  { id: 'dif', name: 'DIF', extension: 'dif', category: 'spreadsheet', mimeType: 'application/x-dif', icon: '📊', description: 'Data Interchange Format' },
  
  // ============================================
  // PRESENTATIONS (7 formats)
  // ============================================
  
  // Core Presentations (Phase 1)
  { id: 'pptx', name: 'PowerPoint', extension: 'pptx', category: 'presentation', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', icon: '📽️', description: 'Microsoft PowerPoint' },
  { id: 'ppt', name: 'PowerPoint (Legacy)', extension: 'ppt', category: 'presentation', mimeType: 'application/vnd.ms-powerpoint', icon: '📽️', description: 'PowerPoint 97-2003' },
  { id: 'odp', name: 'OpenDocument Presentation', extension: 'odp', category: 'presentation', mimeType: 'application/vnd.oasis.opendocument.presentation', icon: '📽️', description: 'OpenDocument Presentation' },
  
  // Extended Office Presentations (Phase 2)
  { id: 'pptm', name: 'PowerPoint Macro', extension: 'pptm', category: 'presentation', mimeType: 'application/vnd.ms-powerpoint.presentation.macroEnabled.12', icon: '📽️', description: 'PowerPoint with Macros' },
  { id: 'pps', name: 'PowerPoint Show', extension: 'pps', category: 'presentation', mimeType: 'application/vnd.ms-powerpoint', icon: '📽️', description: 'PowerPoint Show' },
  { id: 'ppsx', name: 'PowerPoint Show (XML)', extension: 'ppsx', category: 'presentation', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', icon: '📽️', description: 'PowerPoint Show XML' },
  
  // Alternative Presentations (Phase 9)
  { id: 'key', name: 'Keynote', extension: 'key', category: 'presentation', mimeType: 'application/vnd.apple.keynote', icon: '📽️', description: 'Apple Keynote' },
  
  // ============================================
  // IMAGES (50 formats)
  // ============================================
  
  // Core Images (Phase 1)
  { id: 'jpg', name: 'JPEG', extension: 'jpg', category: 'image', mimeType: 'image/jpeg', icon: '🖼️', description: 'JPEG Image' },
  { id: 'jpeg', name: 'JPEG', extension: 'jpeg', category: 'image', mimeType: 'image/jpeg', icon: '🖼️', description: 'JPEG Image' },
  { id: 'png', name: 'PNG', extension: 'png', category: 'image', mimeType: 'image/png', icon: '🖼️', description: 'Portable Network Graphics' },
  { id: 'gif', name: 'GIF', extension: 'gif', category: 'image', mimeType: 'image/gif', icon: '🖼️', description: 'Graphics Interchange Format' },
  { id: 'webp', name: 'WebP', extension: 'webp', category: 'image', mimeType: 'image/webp', icon: '🖼️', description: 'WebP Image' },
  { id: 'bmp', name: 'BMP', extension: 'bmp', category: 'image', mimeType: 'image/bmp', icon: '🖼️', description: 'Bitmap Image' },
  { id: 'tiff', name: 'TIFF', extension: 'tiff', category: 'image', mimeType: 'image/tiff', icon: '🖼️', description: 'Tagged Image File Format' },
  { id: 'tif', name: 'TIFF', extension: 'tif', category: 'image', mimeType: 'image/tiff', icon: '🖼️', description: 'Tagged Image File Format' },
  
  // Modern Image Formats (Phase 4)
  { id: 'heic', name: 'HEIC', extension: 'heic', category: 'image', mimeType: 'image/heic', icon: '🖼️', description: 'High Efficiency Image Container' },
  { id: 'heif', name: 'HEIF', extension: 'heif', category: 'image', mimeType: 'image/heif', icon: '🖼️', description: 'High Efficiency Image Format' },
  { id: 'avif', name: 'AVIF', extension: 'avif', category: 'image', mimeType: 'image/avif', icon: '🖼️', description: 'AV1 Image Format' },
  { id: 'flif', name: 'FLIF', extension: 'flif', category: 'image', mimeType: 'image/flif', icon: '🖼️', description: 'Free Lossless Image Format' },
  
  // Legacy Image Formats (Phase 4)
  { id: 'pcx', name: 'PCX', extension: 'pcx', category: 'image', mimeType: 'image/x-pcx', icon: '🖼️', description: 'PC Paintbrush' },
  { id: 'rle', name: 'RLE', extension: 'rle', category: 'image', mimeType: 'image/rle', icon: '🖼️', description: 'Run-Length Encoded' },
  { id: 'dib', name: 'DIB', extension: 'dib', category: 'image', mimeType: 'image/bmp', icon: '🖼️', description: 'Device Independent Bitmap' },
  { id: 'wbmp', name: 'WBMP', extension: 'wbmp', category: 'image', mimeType: 'image/vnd.wap.wbmp', icon: '🖼️', description: 'Wireless Bitmap' },
  { id: 'pcd', name: 'PCD', extension: 'pcd', category: 'image', mimeType: 'image/x-photo-cd', icon: '🖼️', description: 'Kodak Photo CD' },
  { id: 'pgm', name: 'PGM', extension: 'pgm', category: 'image', mimeType: 'image/x-portable-graymap', icon: '🖼️', description: 'Portable Graymap' },
  { id: 'pict', name: 'PICT', extension: 'pict', category: 'image', mimeType: 'image/pict', icon: '🖼️', description: 'Macintosh PICT' },
  { id: 'tga', name: 'TGA', extension: 'tga', category: 'image', mimeType: 'image/x-tga', icon: '🖼️', description: 'Truevision Targa' },
  { id: 'xcf', name: 'XCF', extension: 'xcf', category: 'image', mimeType: 'image/x-xcf', icon: '🖼️', description: 'GIMP Image' },
  { id: 'yuv', name: 'YUV', extension: 'yuv', category: 'image', mimeType: 'image/x-yuv', icon: '🖼️', description: 'YUV Image' },
  { id: 'hdr', name: 'HDR', extension: 'hdr', category: 'image', mimeType: 'image/vnd.radiance', icon: '🖼️', description: 'High Dynamic Range' },
  
  // Icons (Phase 4)
  { id: 'ico', name: 'ICO', extension: 'ico', category: 'image', mimeType: 'image/x-icon', icon: '🖼️', description: 'Icon File' },
  { id: 'cur', name: 'CUR', extension: 'cur', category: 'image', mimeType: 'image/x-icon', icon: '🖼️', description: 'Cursor File' },
  { id: 'ani', name: 'ANI', extension: 'ani', category: 'image', mimeType: 'application/x-navi-animation', icon: '🖼️', description: 'Animated Cursor' },
  
  // Vector Images (Phase 4)
  { id: 'svg', name: 'SVG', extension: 'svg', category: 'image', mimeType: 'image/svg+xml', icon: '🖼️', description: 'Scalable Vector Graphics' },
  { id: 'svgz', name: 'SVGZ', extension: 'svgz', category: 'image', mimeType: 'image/svg+xml', icon: '🖼️', description: 'Compressed SVG' },
  { id: 'eps', name: 'EPS', extension: 'eps', category: 'image', mimeType: 'application/postscript', icon: '🖼️', description: 'Encapsulated PostScript' },
  { id: 'emf', name: 'EMF', extension: 'emf', category: 'image', mimeType: 'image/x-emf', icon: '🖼️', description: 'Enhanced Metafile' },
  { id: 'wmf', name: 'WMF', extension: 'wmf', category: 'image', mimeType: 'image/x-wmf', icon: '🖼️', description: 'Windows Metafile' },
  
  // Camera RAW Formats (Phase 5)
  { id: 'raw', name: 'RAW', extension: 'raw', category: 'image', mimeType: 'image/x-panasonic-raw', icon: '📷', description: 'Raw Image Data' },
  { id: 'dng', name: 'DNG', extension: 'dng', category: 'image', mimeType: 'image/x-adobe-dng', icon: '📷', description: 'Digital Negative' },
  { id: 'nef', name: 'NEF', extension: 'nef', category: 'image', mimeType: 'image/x-nikon-nef', icon: '📷', description: 'Nikon Electronic Format' },
  { id: 'orf', name: 'ORF', extension: 'orf', category: 'image', mimeType: 'image/x-olympus-orf', icon: '📷', description: 'Olympus Raw Format' },
  { id: 'pef', name: 'PEF', extension: 'pef', category: 'image', mimeType: 'image/x-pentax-pef', icon: '📷', description: 'Pentax Electronic Format' },
  { id: 'raf', name: 'RAF', extension: 'raf', category: 'image', mimeType: 'image/x-fuji-raf', icon: '📷', description: 'Fuji RAW' },
  { id: 'cr2', name: 'CR2', extension: 'cr2', category: 'image', mimeType: 'image/x-canon-cr2', icon: '📷', description: 'Canon Raw 2' },
  { id: 'crw', name: 'CRW', extension: 'crw', category: 'image', mimeType: 'image/x-canon-crw', icon: '📷', description: 'Canon Raw' },
  { id: 'arw', name: 'ARW', extension: 'arw', category: 'image', mimeType: 'image/x-sony-arw', icon: '📷', description: 'Sony Alpha Raw' },
  { id: 'sfw', name: 'SFW', extension: 'sfw', category: 'image', mimeType: 'image/x-seattle-filmworks', icon: '📷', description: 'Seattle Film Works' },
  { id: 'kdc', name: 'KDC', extension: 'kdc', category: 'image', mimeType: 'image/x-kodak-dcr', icon: '📷', description: 'Kodak Digital Camera Raw' },
  
  // Professional Design Formats (Phase 6)
  { id: 'psd', name: 'PSD', extension: 'psd', category: 'image', mimeType: 'image/vnd.adobe.photoshop', icon: '🎨', description: 'Adobe Photoshop' },
  { id: 'ai', name: 'AI', extension: 'ai', category: 'image', mimeType: 'application/postscript', icon: '🎨', description: 'Adobe Illustrator' },
  { id: 'cdr', name: 'CDR', extension: 'cdr', category: 'image', mimeType: 'application/x-coreldraw', icon: '🎨', description: 'CorelDRAW' },
  { id: 'cmx', name: 'CMX', extension: 'cmx', category: 'image', mimeType: 'image/x-cmx', icon: '🎨', description: 'Corel Exchange' },
  { id: 'djvu', name: 'DjVu', extension: 'djvu', category: 'image', mimeType: 'image/vnd.djvu', icon: '📄', description: 'DjVu Document' },
  { id: 'jp2', name: 'JPEG 2000', extension: 'jp2', category: 'image', mimeType: 'image/jp2', icon: '🖼️', description: 'JPEG 2000' },
  { id: 'jpx', name: 'JPX', extension: 'jpx', category: 'image', mimeType: 'image/jpx', icon: '🖼️', description: 'JPEG 2000 Extended' },
  { id: 'fpx', name: 'FPX', extension: 'fpx', category: 'image', mimeType: 'image/vnd.fpx', icon: '🖼️', description: 'FlashPix' },
]

export function getFormatByExtension(extension: string): FileFormat | undefined {
  const ext = extension.toLowerCase().replace('.', '')
  return FILE_FORMATS.find((f) => f.extension.toLowerCase() === ext)
}

export function getFormatsByCategory(category: FormatCategory): FileFormat[] {
  return FILE_FORMATS.filter((f) => f.category === category)
}

export function getCompatibleFormats(sourceFormat: FileFormat): FileFormat[] {
  // Use conversion rules to get only supported target formats
  const { getSupportedTargetFormatIds } = require('./conversion-rules')
  const targetIds = getSupportedTargetFormatIds(sourceFormat.id)
  return targetIds
    .map((id: string) => getFormatInfo(id))
    .filter((f): f is FileFormat => f !== undefined)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get format information by ID
 */
export function getFormatInfo(id: string): FileFormat | undefined {
  return FILE_FORMATS.find((f) => f.id === id)
}

/**
 * Get all possible conversions for a format
 * Uses conversion rules to return only supported conversions
 */
export function getAllConversionsForFormat(formatId: string): FileFormat[] {
  const { getSupportedTargetFormatIds } = require('./conversion-rules')
  const targetIds = getSupportedTargetFormatIds(formatId)
  return targetIds
    .map((id: string) => getFormatInfo(id))
    .filter((f): f is FileFormat => f !== undefined)
}

/**
 * Get conversion count for a format
 * Uses conversion rules to return accurate count
 */
export function getConversionCount(formatId: string): number {
  return getAllConversionsForFormat(formatId).length
}

