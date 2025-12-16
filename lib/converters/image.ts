import sharp from 'sharp'
import { getFormatByExtension } from '@/lib/formats'

export interface ImageConversionOptions {
  quality?: number // 72-300 DPI
  compression?: boolean
  width?: number
  height?: number
  format?: string
}

/**
 * Convert image from one format to another using Sharp
 */
export async function convertImage(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string,
  options: ImageConversionOptions = {}
): Promise<Buffer> {
  const { quality = 90, compression = false, width, height } = options

  let pipeline = sharp(inputBuffer)

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  // Normalize target format (handle jpeg/jpg, tiff/tif)
  const normalizedTarget = targetFormat.toLowerCase()
  const targetFormatMap: Record<string, string> = {
    jpeg: 'jpg',
    tif: 'tiff',
  }
  const finalTarget = targetFormatMap[normalizedTarget] || normalizedTarget

  // Convert based on target format
  switch (finalTarget) {
    case 'jpg':
      return await pipeline
        .jpeg({
          quality: Math.min(quality, 100),
          mozjpeg: compression,
        })
        .toBuffer()

    case 'png':
      return await pipeline
        .png({
          quality: Math.min(quality, 100),
          compressionLevel: compression ? 9 : 6,
        })
        .toBuffer()

    case 'webp':
      return await pipeline
        .webp({
          quality: Math.min(quality, 100),
          effort: compression ? 6 : 4,
        })
        .toBuffer()

    case 'gif':
      // Sharp supports GIF input but not output
      // For Phase 1, we'll convert to PNG as a workaround
      // TODO: Implement proper GIF encoding with gifencoder library in Phase 4
      // Note: This returns PNG data but with .gif extension - user will get PNG quality
      return await pipeline
        .png({
          quality: Math.min(quality, 100),
        })
        .toBuffer()

    case 'bmp':
      return await pipeline.bmp().toBuffer()

    case 'tiff':
      return await pipeline
        .tiff({
          quality: Math.min(quality, 100),
          compression: compression ? 'lzw' : 'none',
        })
        .toBuffer()

    case 'svg':
      // SVG is vector, can't convert from raster
      throw new Error('Cannot convert raster image to SVG. Use vectorization tools.')

    default:
      throw new Error(`Unsupported target format: ${targetFormat}`)
  }
}

/**
 * Resize image while maintaining aspect ratio
 */
export async function resizeImage(
  inputBuffer: Buffer,
  maxWidth: number,
  maxHeight: number
): Promise<Buffer> {
  return await sharp(inputBuffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer()
}

/**
 * Get image metadata
 */
export async function getImageMetadata(inputBuffer: Buffer) {
  const metadata = await sharp(inputBuffer).metadata()
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: inputBuffer.length,
    hasAlpha: metadata.hasAlpha,
    channels: metadata.channels,
  }
}

/**
 * Validate image file
 */
export async function validateImage(inputBuffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(inputBuffer).metadata()
    return !!metadata.format
  } catch {
    return false
  }
}

