/**
 * Legacy Image Format Converter
 * Converts legacy image formats (PCX, RLE, DIB, WBMP, PCD, PGM, PICT, TGA, XCF, YUV, HDR)
 */

import sharp from 'sharp'
import Jimp from 'jimp'

/**
 * Convert legacy image format to standard format
 */
export async function convertLegacyImage(
  inputBuffer: Buffer,
  sourceFormat: string,
  targetFormat: string
): Promise<Buffer> {
  const normalizedSource = sourceFormat.toLowerCase()
  const normalizedTarget = targetFormat.toLowerCase()

  try {
    // Try Sharp first (supports some legacy formats)
    try {
      let pipeline = sharp(inputBuffer)

      switch (normalizedTarget) {
        case 'jpg':
        case 'jpeg':
          return await pipeline.jpeg({ quality: 90 }).toBuffer()

        case 'png':
          return await pipeline.png().toBuffer()

        case 'bmp':
          return await pipeline.bmp().toBuffer()

        case 'tiff':
        case 'tif':
          return await pipeline.tiff().toBuffer()

        default:
          throw new Error('Sharp does not support this target format')
      }
    } catch (sharpError: any) {
      // Fallback to Jimp for formats Sharp doesn't support
      const image = await Jimp.read(inputBuffer)

      switch (normalizedTarget) {
        case 'jpg':
        case 'jpeg':
          return await image.getBufferAsync(Jimp.MIME_JPEG)

        case 'png':
          return await image.getBufferAsync(Jimp.MIME_PNG)

        case 'bmp':
          return await image.getBufferAsync(Jimp.MIME_BMP)

        case 'tiff':
        case 'tif':
          // Jimp doesn't support TIFF output, convert to PNG first then use Sharp
          const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG)
          return await sharp(pngBuffer).tiff().toBuffer()

        default:
          throw new Error(`Unsupported target format for legacy image: ${targetFormat}`)
      }
    }
  } catch (error: any) {
    throw new Error(`Legacy image conversion failed: ${error.message}`)
  }
}

/**
 * Validate legacy image file
 */
export async function validateLegacyImage(
  inputBuffer: Buffer,
  format: string
): Promise<boolean> {
  const normalizedFormat = format.toLowerCase()

  try {
    // Try to read with Sharp or Jimp
    await sharp(inputBuffer).metadata()
    return true
  } catch {
    try {
      await Jimp.read(inputBuffer)
      return true
    } catch {
      return false
    }
  }
}

