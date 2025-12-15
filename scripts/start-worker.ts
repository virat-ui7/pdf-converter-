/**
 * Queue Worker Script
 * Run this script to start processing conversion jobs
 * 
 * Usage: npx tsx scripts/start-worker.ts
 * Or: npm run worker
 */

import { conversionQueue, startQueueProcessor } from '../lib/queue'
import { supabase } from '../lib/supabase'
import { downloadFile, uploadFile, generateFilePath } from '../lib/storage'
import { convertImage } from '../lib/converters/image'
import { convertDocument } from '../lib/converters/document'
import { getFormatByExtension } from '../lib/formats'

console.log('🚀 Starting conversion queue worker...')

// Process conversion jobs
conversionQueue.process(5, async (job) => {
  const {
    conversionId,
    userId,
    originalFileUrl,
    originalFileName,
    sourceFormat,
    targetFormat,
    quality,
    compression,
  } = job.data

  console.log(`Processing conversion ${conversionId}: ${sourceFormat} → ${targetFormat}`)

  try {
    // Update status to processing
    await supabase
      .from('conversions')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversionId)

    // Download original file
    const filePath = originalFileUrl.split('/').slice(-2).join('/')
    const bucket = 'uploads'
    const inputBuffer = await downloadFile(bucket, filePath)

    // Get format info
    const sourceFormatInfo = getFormatByExtension(sourceFormat)
    const targetFormatInfo = getFormatByExtension(targetFormat)

    if (!sourceFormatInfo || !targetFormatInfo) {
      throw new Error('Invalid format')
    }

    let convertedBuffer: Buffer

    // Route to appropriate converter
    if (
      sourceFormatInfo.category === 'image' &&
      targetFormatInfo.category === 'image'
    ) {
      // Image conversion
      convertedBuffer = await convertImage(
        inputBuffer,
        sourceFormat,
        targetFormat,
        {
          quality: quality || 90,
          compression: compression || false,
        }
      )
    } else if (
      sourceFormatInfo.category === 'document' ||
      sourceFormatInfo.category === 'spreadsheet' ||
      sourceFormatInfo.category === 'presentation'
    ) {
      // Document conversion
      convertedBuffer = await convertDocument(
        inputBuffer,
        sourceFormat,
        targetFormat,
        {
          quality: quality,
        }
      )
    } else {
      throw new Error(
        `Conversion from ${sourceFormat} to ${targetFormat} is not supported`
      )
    }

    // Upload converted file
    const outputFileName = originalFileName.replace(
      `.${sourceFormat}`,
      `.${targetFormat}`
    )
    const outputPath = generateFilePath(userId || null, outputFileName, 'converted')
    const outputUrl = await uploadFile(
      'converted',
      outputPath,
      convertedBuffer,
      targetFormatInfo.mimeType
    )

    // Update conversion record
    await supabase
      .from('conversions')
      .update({
        status: 'completed',
        converted_file_url: outputUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversionId)

    // Update user conversion count
    if (userId) {
      await supabase.rpc('increment_conversions_used', {
        user_id_param: userId,
      }).catch(() => {
        // If RPC doesn't exist, manually update
        const { data: user } = await supabase
          .from('users')
          .select('conversions_used')
          .eq('id', userId)
          .single()

        if (user) {
          await supabase
            .from('users')
            .update({
              conversions_used: (user.conversions_used || 0) + 1,
            })
            .eq('id', userId)
        }
      })

      // Send email notification
      const { data: user } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', userId)
        .single()

      if (user?.email) {
        const { sendConversionCompletedEmail } = await import('../lib/email')
        await sendConversionCompletedEmail(
          user.email,
          originalFileName,
          outputUrl
        )
      }

      // Track analytics
      const { trackConversion } = await import('../lib/analytics')
      await trackConversion(
        conversionId,
        userId,
        sourceFormat,
        targetFormat,
        job.data.originalFileUrl ? 0 : 0 // File size would need to be passed
      )
    }

    console.log(`✅ Conversion ${conversionId} completed: ${outputUrl}`)

    return {
      success: true,
      conversionId,
      downloadUrl: outputUrl,
    }
  } catch (error: any) {
    console.error(`❌ Conversion ${conversionId} failed:`, error.message)

    // Update status to failed
    await supabase
      .from('conversions')
      .update({
        status: 'failed',
        error_message: error.message,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversionId)

    // Send error email if user exists
    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single()

      if (user?.email) {
        const { sendConversionFailedEmail } = await import('../lib/email')
        await sendConversionFailedEmail(
          user.email,
          originalFileName,
          error.message
        )
      }
    }

    throw error
  }
})

// Start the processor
startQueueProcessor()

console.log('✅ Queue worker started. Processing jobs...')

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  await conversionQueue.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...')
  await conversionQueue.close()
  process.exit(0)
})

