/**
 * Vector Image Format Converter
 * Converts vector formats (SVG, SVGZ, EPS, EMF, WMF) to raster or other formats
 */

import sharp from 'sharp'
import * as fs from 'fs/promises'
import * as path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'
import { PDFDocument } from 'pdf-lib'

const execAsync = promisify(exec)

export interface VectorConversionOptions {
  width?: number
  height?: number
  dpi?: number
}

/**
 * Convert SVG/SVGZ to raster formats
 */
export async function convertSVG(
  inputBuffer: Buffer,
  targetFormat: string,
  options: VectorConversionOptions = {}
): Promise<Buffer> {
  const normalizedTarget = targetFormat.toLowerCase()
  const { width = 1024, height = 1024, dpi = 300 } = options

  try {
    let svgBuffer = inputBuffer

    // Handle SVGZ (compressed SVG)
    if (inputBuffer.subarray(0, 2).equals(Buffer.from('\x1f\x8b'))) {
      // SVGZ is gzipped SVG - Sharp can handle it directly
    }

    let pipeline = sharp(svgBuffer, { density: dpi })

    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: false,
      })
    }

    // Convert to target format
    switch (normalizedTarget) {
      case 'png':
        return await pipeline.png().toBuffer()

      case 'jpg':
      case 'jpeg':
        return await pipeline.jpeg({ quality: 90 }).toBuffer()

      case 'pdf':
        // Convert SVG to PNG first, then embed in PDF
        const pngBuffer = await pipeline.png().toBuffer()
        const pdfDoc = await PDFDocument.create()
        const pngImage = await pdfDoc.embedPng(pngBuffer)
        const page = pdfDoc.addPage([width, height])
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        })
        return Buffer.from(await pdfDoc.save())

      case 'eps':
        // SVG to EPS - use Inkscape or Ghostscript
        return await convertSVGToEPS(inputBuffer, options)

      default:
        throw new Error(`Unsupported target format for SVG: ${targetFormat}`)
    }
  } catch (error: any) {
    throw new Error(`SVG conversion failed: ${error.message}`)
  }
}

/**
 * Convert EPS to other formats
 */
export async function convertEPS(
  inputBuffer: Buffer,
  targetFormat: string,
  options: VectorConversionOptions = {}
): Promise<Buffer> {
  const normalizedTarget = targetFormat.toLowerCase()

  // Use Ghostscript for EPS conversion
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-eps-'))
  const inputPath = path.join(tempDir, 'input.eps')
  const outputPath = path.join(tempDir, `output.${normalizedTarget}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    let command: string
    switch (normalizedTarget) {
      case 'pdf':
        command = `gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outputPath}" "${inputPath}"`
        break

      case 'png':
        command = `gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r300 -sOutputFile="${outputPath}" "${inputPath}"`
        break

      case 'jpg':
      case 'jpeg':
        command = `gs -dNOPAUSE -dBATCH -sDEVICE=jpeg -r300 -sOutputFile="${outputPath}" "${inputPath}"`
        break

      case 'svg':
        // EPS to SVG - use Inkscape
        command = `inkscape "${inputPath}" --export-filename="${outputPath}"`
        break

      default:
        throw new Error(`Unsupported target format for EPS: ${targetFormat}`)
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
        'Ghostscript or Inkscape is not installed. Please install Ghostscript or Inkscape on the server.'
      )
    }

    throw new Error(`EPS conversion failed: ${error.message}`)
  }
}

/**
 * Convert EMF/WMF to raster formats
 */
export async function convertEMF(
  inputBuffer: Buffer,
  targetFormat: string,
  options: VectorConversionOptions = {}
): Promise<Buffer> {
  // EMF/WMF conversion requires LibreOffice or specialized tools
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-emf-'))
  const inputPath = path.join(tempDir, 'input.emf')
  const outputPath = path.join(tempDir, `output.${targetFormat}`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const formatMap: Record<string, string> = {
      png: 'png',
      jpg: 'jpg',
      pdf: 'pdf',
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
    throw new Error(`EMF conversion failed: ${error.message}`)
  }
}

/**
 * Convert SVG to EPS using Inkscape
 */
async function convertSVGToEPS(
  inputBuffer: Buffer,
  options: VectorConversionOptions
): Promise<Buffer> {
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'svg-eps-'))
  const inputPath = path.join(tempDir, 'input.svg')
  const outputPath = path.join(tempDir, 'output.eps')

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const command = `inkscape "${inputPath}" --export-filename="${outputPath}"`
    await execAsync(command, {
      timeout: 60000,
      maxBuffer: 10 * 1024 * 1024,
    })

    const convertedBuffer = await fs.readFile(outputPath)
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})
    throw new Error(`SVG to EPS conversion failed: ${error.message}`)
  }
}

/**
 * Validate vector file
 */
export async function validateVector(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  const normalizedFormat = format.toLowerCase()

  try {
    if (normalizedFormat === 'svg' || normalizedFormat === 'svgz') {
      const text = inputBuffer.toString('utf-8')
      return text.includes('<svg') || text.includes('<?xml')
    } else if (normalizedFormat === 'eps') {
      const text = inputBuffer.toString('utf-8')
      return text.includes('%!PS') || text.includes('%!EPS')
    } else if (normalizedFormat === 'emf' || normalizedFormat === 'wmf') {
      // EMF/WMF are Windows metafiles
      return inputBuffer.subarray(0, 4).equals(Buffer.from('\x01\x00\x00\x00')) ||
             inputBuffer.subarray(0, 4).equals(Buffer.from('EMF\x00'))
    }
    return false
  } catch {
    return false
  }
}

