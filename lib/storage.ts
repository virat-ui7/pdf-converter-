import { supabase } from './supabase'

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  filePath: string,
  fileBuffer: Buffer,
  contentType?: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType: contentType || 'application/octet-stream',
      upsert: false, // Don't overwrite existing files
    })

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return urlData.publicUrl
}

/**
 * Download file from Supabase Storage
 */
export async function downloadFile(
  bucket: string,
  filePath: string
): Promise<Buffer> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filePath)

  if (error) {
    throw new Error(`Failed to download file: ${error.message}`)
  }

  // Convert Blob to Buffer
  const arrayBuffer = await data.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([filePath])

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Get file URL (public or signed)
 */
export function getFileUrl(
  bucket: string,
  filePath: string,
  signed: boolean = false
): string {
  if (signed) {
    // For signed URLs, would need to generate with expiration
    // This is a placeholder - implement signed URL generation if needed
    const { data } = supabase.storage.from(bucket).createSignedUrl(filePath, 3600)
    return data?.signedUrl || ''
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Generate unique file path
 */
export function generateFilePath(
  userId: string | null,
  fileName: string,
  prefix: string = 'conversions'
): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const userPrefix = userId ? `${userId}/` : 'anonymous/'

  return `${prefix}/${userPrefix}${timestamp}_${random}_${sanitizedFileName}`
}

