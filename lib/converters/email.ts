/**
 * Email Format Converter
 * Converts email formats (EML, MSG) to documents
 */

import { simpleParser } from 'mailparser'
import * as fs from 'fs/promises'
import * as path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface EmailConversionOptions {
  includeAttachments?: boolean
}

/**
 * Convert EML to other formats
 */
export async function convertEML(
  inputBuffer: Buffer,
  targetFormat: string,
  options: EmailConversionOptions = {}
): Promise<Buffer> {
  const normalizedTarget = targetFormat.toLowerCase()

  try {
    // Parse EML file
    const parsed = await simpleParser(inputBuffer)

    // Convert based on target format
    switch (normalizedTarget) {
      case 'txt':
        // Extract plain text
        const text = parsed.text || parsed.textAsHtml || ''
        return Buffer.from(text, 'utf-8')

      case 'html':
      case 'htm':
        // Extract HTML
        const html = parsed.html || parsed.textAsHtml || parsed.text || ''
        return Buffer.from(html, 'utf-8')

      case 'pdf':
      case 'docx':
        // Use LibreOffice for PDF/DOCX conversion
        return await convertEmailToDocument(inputBuffer, 'eml', normalizedTarget)

      default:
        throw new Error(`Unsupported target format for EML: ${targetFormat}`)
    }
  } catch (error: any) {
    throw new Error(`EML conversion failed: ${error.message}`)
  }
}

/**
 * Convert MSG to other formats
 * Note: MSG format requires msgreader library or LibreOffice
 */
export async function convertMSG(
  inputBuffer: Buffer,
  targetFormat: string,
  options: EmailConversionOptions = {}
): Promise<Buffer> {
  const normalizedTarget = targetFormat.toLowerCase()

  // For Phase 3, use LibreOffice for MSG conversion
  // In future, could use msgreader library if available
  return await convertEmailToDocument(inputBuffer, 'msg', normalizedTarget)
}

/**
 * Convert email to document using LibreOffice
 */
async function convertEmailToDocument(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string
): Promise<Buffer> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-email-'))
  const inputPath = path.join(tempDir, `input.${sourceFormat}`)
  const outputPath = path.join(tempDir, `output.${targetFormat}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const formatMap: Record<string, string> = {
      pdf: 'pdf',
      docx: 'docx:"MS Word 2007 XML"',
      txt: 'txt',
      html: 'html',
    }

    const outputFormat = formatMap[targetFormat] || targetFormat
    const command = `libreoffice --headless --convert-to ${outputFormat} --outdir "${tempDir}" "${inputPath}"`

    await execAsync(command, {
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const convertedBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw new Error(`Email to document conversion failed: ${error.message}`)
  }
}

/**
 * Validate email file
 */
export async function validateEmail(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  const normalizedFormat = format.toLowerCase()

  try {
    if (normalizedFormat === 'eml') {
      // Try to parse as EML
      await simpleParser(inputBuffer)
      return true
    } else if (normalizedFormat === 'msg') {
      // MSG files start with specific OLE2 signature
      return inputBuffer.subarray(0, 8).equals(Buffer.from('\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1'))
    }
    return false
  } catch {
    return false
  }
}

