import * as fs from 'fs/promises'
import * as path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'
import PptxGenJS from 'pptxgenjs'

const execAsync = promisify(exec)

export interface PresentationConversionOptions {
  quality?: number
  slideRange?: string
}

/**
 * Convert presentation from one format to another
 * Supports: PPTX, PPT, ODP, PDF
 */
export async function convertPresentation(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string,
  options: PresentationConversionOptions = {}
): Promise<Buffer> {
  const normalizedSource = sourceFormat.toLowerCase()
  const normalizedTarget = targetFormat.toLowerCase()

  // Handle same format
  if (normalizedSource === normalizedTarget) {
    return inputBuffer
  }

  // Handle extended Office presentation formats (PPTM, PPS, PPSX) - treat like PPTX
  // For Phase 1, we'll use LibreOffice for most conversions
  // This is the most reliable method for presentation formats
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-pres-'))
  const inputPath = path.join(tempDir, `input.${normalizedSource}`)
  const outputPath = path.join(tempDir, `output.${normalizedTarget}`)

  try {
    // Write input file
    await fs.writeFile(inputPath, inputBuffer)

    // Determine LibreOffice output format
    const outputFormat = getLibreOfficePresentationFormat(normalizedTarget)

    // Run LibreOffice conversion
    const command = `libreoffice --headless --convert-to ${outputFormat} --outdir "${tempDir}" "${inputPath}"`

    await execAsync(command, {
      timeout: 300000, // 5 minutes timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    })

    // Read converted file
    const convertedBuffer = await fs.readFile(outputPath)

    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    // Cleanup on error
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})

    if (error.code === 'ENOENT') {
      throw new Error(
        'LibreOffice is not installed. Please install LibreOffice on the server.'
      )
    }

    throw new Error(`Presentation conversion failed: ${error.message}`)
  }
}

/**
 * Map presentation format to LibreOffice output format
 */
function getLibreOfficePresentationFormat(format: string): string {
  const formatMap: Record<string, string> = {
    pdf: 'pdf',
    pptx: 'pptx:"Impress MS PowerPoint 2007 XML"',
    ppt: 'ppt:"Impress MS PowerPoint 97"',
    odp: 'odp',
  }

  return formatMap[format.toLowerCase()] || format
}

/**
 * Create a new PowerPoint presentation (for programmatic generation)
 * This can be used in future phases for creating presentations from data
 */
export async function createPresentation(
  slides: Array<{ title: string; content: string }>
): Promise<Buffer> {
  const pptx = new PptxGenJS()

  slides.forEach((slide) => {
    const slideObj = pptx.addSlide()
    slideObj.addText(slide.title, {
      x: 0.5,
      y: 1,
      w: 9,
      h: 1.5,
      fontSize: 44,
      bold: true,
    })
    slideObj.addText(slide.content, {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 4,
      fontSize: 18,
    })
  })

  // Generate buffer
  return Buffer.from(await pptx.write({ outputType: 'arraybuffer' }))
}

/**
 * Convert Keynote to other formats
 */
export async function convertKeynote(
  inputBuffer: Buffer,
  targetFormat: string,
  options: PresentationConversionOptions = {}
): Promise<Buffer> {
  const normalizedTarget = targetFormat.toLowerCase()

  // Keynote conversion requires LibreOffice
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-keynote-'))
  const inputPath = path.join(tempDir, 'input.key')
  const outputPath = path.join(tempDir, `output.${normalizedTarget}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const formatMap: Record<string, string> = {
      pptx: 'pptx:"Impress MS PowerPoint 2007 XML"',
      pdf: 'pdf',
    }

    const outputFormat = formatMap[normalizedTarget] || normalizedTarget
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

    if (error.code === 'ENOENT') {
      throw new Error(
        'LibreOffice is not installed. Please install LibreOffice on the server.'
      )
    }

    throw new Error(`Keynote conversion failed: ${error.message}`)
  }
}

/**
 * Validate presentation file
 */
export async function validatePresentation(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  const normalizedFormat = format.toLowerCase()

  try {
    switch (normalizedFormat) {
      case 'pptx':
      case 'pptm':
      case 'ppsx':
        // PPTX is a ZIP file
        return inputBuffer.subarray(0, 4).equals(Buffer.from('PK\x03\x04'))

      case 'ppt':
      case 'pps':
        // PPT is OLE2 format
        return inputBuffer.subarray(0, 8).equals(Buffer.from('\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1'))

      case 'odp':
        // ODP is a ZIP file
        return inputBuffer.subarray(0, 4).equals(Buffer.from('PK\x03\x04'))

      case 'pdf':
        // PDF signature
        return inputBuffer.subarray(0, 4).equals(Buffer.from('%PDF'))

      default:
        return true // Unknown format, assume valid
    }
  } catch {
    return false
  }
}

