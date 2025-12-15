// Supported file formats database

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
  // Documents
  { id: 'pdf', name: 'PDF', extension: 'pdf', category: 'document', mimeType: 'application/pdf', icon: '📄' },
  { id: 'docx', name: 'Word', extension: 'docx', category: 'document', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: '📝' },
  { id: 'doc', name: 'Word (Legacy)', extension: 'doc', category: 'document', mimeType: 'application/msword', icon: '📝' },
  { id: 'txt', name: 'Text', extension: 'txt', category: 'document', mimeType: 'text/plain', icon: '📄' },
  { id: 'rtf', name: 'Rich Text', extension: 'rtf', category: 'document', mimeType: 'application/rtf', icon: '📄' },
  { id: 'odt', name: 'OpenDocument Text', extension: 'odt', category: 'document', mimeType: 'application/vnd.oasis.opendocument.text', icon: '📄' },
  { id: 'html', name: 'HTML', extension: 'html', category: 'document', mimeType: 'text/html', icon: '🌐' },
  { id: 'epub', name: 'ePub', extension: 'epub', category: 'document', mimeType: 'application/epub+zip', icon: '📚' },
  { id: 'mobi', name: 'Mobi', extension: 'mobi', category: 'document', mimeType: 'application/x-mobipocket-ebook', icon: '📚' },
  
  // Images
  { id: 'jpg', name: 'JPEG', extension: 'jpg', category: 'image', mimeType: 'image/jpeg', icon: '🖼️' },
  { id: 'jpeg', name: 'JPEG', extension: 'jpeg', category: 'image', mimeType: 'image/jpeg', icon: '🖼️' },
  { id: 'png', name: 'PNG', extension: 'png', category: 'image', mimeType: 'image/png', icon: '🖼️' },
  { id: 'gif', name: 'GIF', extension: 'gif', category: 'image', mimeType: 'image/gif', icon: '🖼️' },
  { id: 'webp', name: 'WebP', extension: 'webp', category: 'image', mimeType: 'image/webp', icon: '🖼️' },
  { id: 'svg', name: 'SVG', extension: 'svg', category: 'image', mimeType: 'image/svg+xml', icon: '🖼️' },
  { id: 'bmp', name: 'BMP', extension: 'bmp', category: 'image', mimeType: 'image/bmp', icon: '🖼️' },
  { id: 'tiff', name: 'TIFF', extension: 'tiff', category: 'image', mimeType: 'image/tiff', icon: '🖼️' },
  { id: 'ico', name: 'ICO', extension: 'ico', category: 'image', mimeType: 'image/x-icon', icon: '🖼️' },
  { id: 'heic', name: 'HEIC', extension: 'heic', category: 'image', mimeType: 'image/heic', icon: '🖼️' },
  
  // Spreadsheets
  { id: 'xlsx', name: 'Excel', extension: 'xlsx', category: 'spreadsheet', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: '📊' },
  { id: 'xls', name: 'Excel (Legacy)', extension: 'xls', category: 'spreadsheet', mimeType: 'application/vnd.ms-excel', icon: '📊' },
  { id: 'csv', name: 'CSV', extension: 'csv', category: 'spreadsheet', mimeType: 'text/csv', icon: '📊' },
  { id: 'ods', name: 'OpenDocument Spreadsheet', extension: 'ods', category: 'spreadsheet', mimeType: 'application/vnd.oasis.opendocument.spreadsheet', icon: '📊' },
  { id: 'tsv', name: 'TSV', extension: 'tsv', category: 'spreadsheet', mimeType: 'text/tab-separated-values', icon: '📊' },
  
  // Presentations
  { id: 'pptx', name: 'PowerPoint', extension: 'pptx', category: 'presentation', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', icon: '📽️' },
  { id: 'ppt', name: 'PowerPoint (Legacy)', extension: 'ppt', category: 'presentation', mimeType: 'application/vnd.ms-powerpoint', icon: '📽️' },
  { id: 'odp', name: 'OpenDocument Presentation', extension: 'odp', category: 'presentation', mimeType: 'application/vnd.oasis.opendocument.presentation', icon: '📽️' },
]

export function getFormatByExtension(extension: string): FileFormat | undefined {
  const ext = extension.toLowerCase().replace('.', '')
  return FILE_FORMATS.find((f) => f.extension.toLowerCase() === ext)
}

export function getFormatsByCategory(category: FormatCategory): FileFormat[] {
  return FILE_FORMATS.filter((f) => f.category === category)
}

export function getCompatibleFormats(sourceFormat: FileFormat): FileFormat[] {
  // Return all formats except the source format
  return FILE_FORMATS.filter((f) => f.id !== sourceFormat.id)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

