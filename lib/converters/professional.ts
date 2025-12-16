/**
 * Professional Design Format Converter
 * Converts professional design formats (PSD, AI, CDR, CMX, DJVU, JP2, JPX, FPX)
 */

import sharp from 'sharp'
import * as fs from 'fs/promises'
import * as path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'
import { PDFDocument } from 'pdf-lib'

const execAsync = promisify(exec)

/**
 * Convert PSD to other formats
 */
export async function convertPSD(
  inputBuffer: Buffer,
  targetFormat: string
): Promise<Buffer> {
  const normalizedTarget = targetFormat.toLowerCase()

  try {
    // Try to use ag-psd library
    const { readPsd } = await import('ag-psd')
    const psd = readPsd(inputBuffer)

    // Extract image data from PSD
    if (!psd.canvas) {
      throw new Error('PSD file does not contain image data')
    }

    // Convert canvas to buffer
    const imageBuffer = Buffer.from(psd.canvas.toDataURL('image/png').split(',')[1], 'base64')

    // Use Sharp to convert to target format
    let pipeline = sharp(imageBuffer)

    switch (normalizedTarget) {
      case 'png':
        return await pipeline.png().toBuffer()

      case 'jpg':
      case 'jpeg':
        return await pipeline.jpeg({ quality: 90 }).toBuffer()

      case 'pdf':
        const pngBuffer = await pipeline.png().toBuffer()
        const pdfDoc = await PDFDocument.create()
        const pngImage = await pdfDoc.embedPng(pngBuffer)
        const page = pdfDoc.addPage([psd.width || 1024, psd.height || 1024])
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        })
        return Buffer.from(await pdfDoc.save())

      default:
        throw new Error(`Unsupported target format for PSD: ${targetFormat}`)
    }
  } catch (error: any) {
    // Fallback to LibreOffice if ag-psd fails
    return await convertProfessionalWithLibreOffice(inputBuffer, 'psd', normalizedTarget)
  }
}

/**
 * Convert AI to other formats
 */
export async function convertAI(
  inputBuffer: Buffer,
  targetFormat: string
): Promise<Buffer> {
  const normalizedTarget = targetFormat.toLowerCase()

  // AI files are often PDF-based or PostScript
  // Use Ghostscript or LibreOffice for conversion
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-ai-'))
  const inputPath = path.join(tempDir, 'input.ai')
  const outputPath = path.join(tempDir, `output.${normalizedTarget}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    let command: string
    if (normalizedTarget === 'pdf') {
      command = `gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outputPath}" "${inputPath}"`
    } else if (normalizedTarget === 'svg') {
      command = `inkscape "${inputPath}" --export-filename="${outputPath}"`
    } else {
      // Use LibreOffice for other formats
      const formatMap: Record<string, string> = {
        png: 'png',
        jpg: 'jpg',
      }
      const outputFormat = formatMap[normalizedTarget] || normalizedTarget
      command = `libreoffice --headless --convert-to ${outputFormat} --outdir "${tempDir}" "${inputPath}"`
    }

    await execAsync(command, {
      timeout: 300000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const convertedBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw new Error(`AI conversion failed: ${error.message}`)
  }
}

/**
 * Convert DjVu to other formats
 */
export async function convertDjVu(
  inputBuffer: Buffer,
  targetFormat: string
): Promise<Buffer> {
  const normalizedTarget = targetFormat.toLowerCase()

  // Use ddjvu (DjVu tools) for conversion
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-djvu-'))
  const inputPath = path.join(tempDir, 'input.djvu')
  const outputPath = path.join(tempDir, `output.${normalizedTarget}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    let command: string
    if (normalizedTarget === 'pdf') {
      command = `ddjvu -format=pdf "${inputPath}" "${outputPath}"`
    } else if (normalizedTarget === 'png') {
      command = `ddjvu -format=png "${inputPath}" "${outputPath}"`
    } else {
      throw new Error(`Unsupported target format for DjVu: ${targetFormat}`)
    }

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
        'DjVu tools (ddjvu) is not installed. Please install djvulibre on the server.'
      )
    }

    throw new Error(`DjVu conversion failed: ${error.message}`)
  }
}

/**
 * Convert JPEG 2000 (JP2, JPX) to standard formats
 */
export async function convertJPEG2000(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string
): Promise<Buffer> {
  const normalizedTarget = targetFormat.toLowerCase()

  // Use openjpeg or Sharp (if it supports JPEG 2000)
  try {
    // Try Sharp first (may support JPEG 2000 in some versions)
    let pipeline = sharp(inputBuffer)

    switch (normalizedTarget) {
      case 'jpg':
      case 'jpeg':
        return await pipeline.jpeg({ quality: 90 }).toBuffer()

      case 'png':
        return await pipeline.png().toBuffer()

      default:
        throw new Error(`Unsupported target format for JPEG 2000: ${targetFormat}`)
    }
  } catch (error: any) {
    // Fallback to openjpeg CLI tool
    const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-jp2-'))
    const inputPath = path.join(tempDir, `input.${sourceFormat}`)
    const outputPath = path.join(tempDir, `output.${normalizedTarget}`)

    try {
      await fs.writeFile(inputPath, inputBuffer)

      const command = `opj_decompress -i "${inputPath}" -o "${outputPath}"`
      await execAsync(command, {
        timeout: 300000,
        maxBuffer: 10 * 1024 * 1024,
      })

      const convertedBuffer = await fs.readFile(outputPath)
      await fs.rm(tempDir, { recursive: true, force: true })

      return convertedBuffer
    } catch (error2: any) {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
      throw new Error(`JPEG 2000 conversion failed: ${error2.message}`)
    }
  }
}

/**
 * Convert CorelDRAW formats (CDR, CMX)
 */
export async function convertCorelDRAW(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string
): Promise<Buffer> {
  // CorelDRAW formats require LibreOffice or specialized tools
  return await convertProfessionalWithLibreOffice(inputBuffer, sourceFormat, targetFormat)
}

/**
 * Convert FlashPix (FPX) to other formats
 */
export async function convertFPX(
  inputBuffer: Buffer,
  targetFormat: string
): Promise<Buffer> {
  // FPX conversion - use ImageMagick or LibreOffice
  return await convertProfessionalWithLibreOffice(inputBuffer, 'fpx', targetFormat)
}

/**
 * Generic function to convert professional formats using LibreOffice
 */
async function convertProfessionalWithLibreOffice(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string
): Promise<Buffer> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-pro-'))
  const inputPath = path.join(tempDir, `input.${sourceFormat}`)
  const outputPath = path.join(tempDir, `output.${targetFormat}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const formatMap: Record<string, string> = {
      pdf: 'pdf',
      png: 'png',
      jpg: 'jpg',
    }

    const outputFormat = formatMap[targetFormat.toLowerCase()] || targetFormat
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
    throw new Error(`Professional format conversion failed: ${error.message}`)
  }
}

/**
 * Validate professional design file
 */
export async function validateProfessional(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  const normalizedFormat = format.toLowerCase()

  try {
    if (normalizedFormat === 'psd') {
      // PSD signature
      return inputBuffer.subarray(0, 4).equals(Buffer.from('8BPS'))
    } else if (normalizedFormat === 'ai') {
      // AI can be PDF-based or PostScript
      return inputBuffer.subarray(0, 4).equals(Buffer.from('%PDF')) ||
             inputBuffer.subarray(0, 2).equals(Buffer.from('%!'))
    } else if (normalizedFormat === 'djvu') {
      // DjVu signature
      return inputBuffer.subarray(0, 4).equals(Buffer.from('AT&T'))
    } else if (normalizedFormat === 'jp2' || normalizedFormat === 'jpx') {
      // JPEG 2000 signature
      return inputBuffer.subarray(0, 12).equals(Buffer.from('\x00\x00\x00\x0cjP  \r\n\x87\n'))
    }
    return true // Unknown format, assume valid
  } catch {
    return false
  }
}

