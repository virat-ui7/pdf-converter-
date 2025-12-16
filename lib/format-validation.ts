/**
 * Format validation utilities
 * Centralized magic bytes validation for all file types
 */

import { validateDocument } from './converters/document'
import { validateImage } from './converters/image'
import { validateSpreadsheet } from './converters/spreadsheet'
import { validatePresentation } from './converters/presentation'
import { getFormatInfo, type FormatCategory } from './formats'

/**
 * Validate file content matches its declared format using magic bytes
 */
export async function validateFileFormat(
  inputBuffer: Buffer,
  declaredFormat: string
): Promise<{
  valid: boolean
  error?: string
  detectedFormat?: string
}> {
  try {
    const formatInfo = getFormatInfo(declaredFormat)
    
    if (!formatInfo) {
      return {
        valid: false,
        error: `Unknown format: ${declaredFormat}`,
      }
    }

    // Route to appropriate validator based on category
    let isValid = false

    switch (formatInfo.category) {
      case 'document':
        isValid = await validateDocument(inputBuffer, declaredFormat)
        break
      case 'image':
        isValid = await validateImage(inputBuffer)
        break
      case 'spreadsheet':
        isValid = await validateSpreadsheet(inputBuffer, declaredFormat)
        break
      case 'presentation':
        isValid = await validatePresentation(inputBuffer, declaredFormat)
        break
      default:
        // Unknown category - skip validation (may be a new format)
        isValid = true
    }

    if (!isValid) {
      return {
        valid: false,
        error: `File content does not match the declared format (${formatInfo.name}). The file may be corrupted or have an incorrect extension.`,
      }
    }

    return { valid: true }
  } catch (error: any) {
    // If validation throws, treat as invalid
    return {
      valid: false,
      error: `File validation failed: ${error.message || 'Unknown error'}`,
    }
  }
}

/**
 * Check if file extension matches content (magic bytes)
 * Returns true if match or if validation is not available for format
 */
export async function validateExtensionMatch(
  inputBuffer: Buffer,
  extension: string,
  declaredFormat: string
): Promise<{
  match: boolean
  error?: string
}> {
  // If extension and declared format don't match, that's a separate issue
  // This function focuses on content validation
  const validation = await validateFileFormat(inputBuffer, declaredFormat)
  
  if (!validation.valid) {
    return {
      match: false,
      error: validation.error || 'File content does not match declared format',
    }
  }

  return { match: true }
}

