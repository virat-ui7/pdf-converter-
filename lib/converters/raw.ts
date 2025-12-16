/**
 * Camera RAW Format Converter
 * Converts camera RAW formats to standard image formats
 * Supports: RAW, DNG, NEF, ORF, PEF, RAF, CR2, CRW, ARW, SFW, KDC
 */

import sharp from 'sharp'
import * as fs from 'fs/promises'
import * as path from 'path'
import { tmpdir } from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface RawConversionOptions {
  quality?: number
  width?: number
  height?: number
}

/**
 * Convert RAW format to standard image format
 * Uses dcraw or libraw (CLI tools) for RAW processing
 */
export async function convertRAW(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string,
  options: RawConversionOptions = {}
): Promise<Buffer> {
  const normalizedSource = sourceFormat.toLowerCase()
  const normalizedTarget = targetFormat.toLowerCase()
  const { quality = 90, width, height } = options

  // For Phase 5, we'll use dcraw (CLI tool) to convert RAW to TIFF/JPEG
  // Then use Sharp to convert to target format
  const tempDir = await fs.mkdtemp(path.join(tmpdir(), 'convert-raw-'))
  const inputPath = path.join(tempDir, `input.${normalizedSource}`)
  const intermediatePath = path.join(tempDir, 'intermediate.tiff')
  const outputPath = path.join(tempDir, `output.${normalizedTarget}`)

  try {
    // Write input RAW file
    await fs.writeFile(inputPath, inputBuffer)

    // Step 1: Convert RAW to TIFF using dcraw
    // Note: dcraw must be installed on the server
    const dcrawCommand = `dcraw -c -w "${inputPath}" > "${intermediatePath}"`
    
    try {
      await execAsync(dcrawCommand, {
        timeout: 60000, // 1 minute for RAW processing
        maxBuffer: 50 * 1024 * 1024, // 50MB buffer for RAW files
      })
    } catch (error: any) {
      // If dcraw fails, try libraw
      const librawCommand = `rawtherapee-cli -o "${intermediatePath}" "${inputPath}"`
      await execAsync(librawCommand, {
        timeout: 60000,
        maxBuffer: 50 * 1024 * 1024,
      })
    }

    // Step 2: Read intermediate TIFF and convert to target format using Sharp
    const intermediateBuffer = await fs.readFile(intermediatePath)
    let pipeline = sharp(intermediateBuffer)

    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    // Convert to target format
    let convertedBuffer: Buffer
    switch (normalizedTarget) {
      case 'jpg':
      case 'jpeg':
        convertedBuffer = await pipeline
          .jpeg({ quality: Math.min(quality, 100) })
          .toBuffer()
        break

      case 'png':
        convertedBuffer = await pipeline
          .png({ quality: Math.min(quality, 100) })
          .toBuffer()
        break

      case 'tiff':
      case 'tif':
        convertedBuffer = await pipeline
          .tiff({ quality: Math.min(quality, 100) })
          .toBuffer()
        break

      default:
        throw new Error(`Unsupported target format for RAW: ${targetFormat}`)
    }

    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true })

    return convertedBuffer
  } catch (error: any) {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {})

    if (error.code === 'ENOENT') {
      throw new Error(
        'RAW processing tool (dcraw or libraw) is not installed. Please install dcraw or libraw on the server.'
      )
    }

    throw new Error(`RAW conversion failed: ${error.message}`)
  }
}

/**
 * Validate RAW file
 */
export async function validateRAW(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  const normalizedFormat = format.toLowerCase()

  // RAW formats have various signatures depending on camera manufacturer
  const rawSignatures: Record<string, Buffer[]> = {
    dng: [Buffer.from('II*\x00'), Buffer.from('MM\x00*')], // TIFF-based
    nef: [Buffer.from('MM\x00*'), Buffer.from('II*\x00')], // Nikon
    cr2: [Buffer.from('II*\x00')], // Canon
    crw: [Buffer.from('II*\x00')], // Canon
    arw: [Buffer.from('II*\x00')], // Sony
    orf: [Buffer.from('II*\x00'), Buffer.from('MM\x00*')], // Olympus
    pef: [Buffer.from('II*\x00')], // Pentax
    raf: [Buffer.from('FUJIFILM')], // Fuji
  }

  const signatures = rawSignatures[normalizedFormat]
  if (!signatures) return true // Unknown RAW format, assume valid

  return signatures.some((sig) =>
    inputBuffer.subarray(0, sig.length).equals(sig)
  )
}

