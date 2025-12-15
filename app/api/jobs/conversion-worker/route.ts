import { NextRequest, NextResponse } from 'next/server'
import { conversionQueue, addConversionJob, type ConversionJob } from '@/lib/queue'
import { supabase } from '@/lib/supabase'
import { uploadFile, downloadFile, generateFilePath, deleteFile } from '@/lib/storage'
import { convertImage } from '@/lib/converters/image'
import { convertDocument } from '@/lib/converters/document'
import { getFormatByExtension } from '@/lib/formats'

/**
 * Process a conversion job
 * This endpoint is called by the queue worker
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      conversionId,
      userId,
      originalFileUrl,
      originalFileName,
      sourceFormat,
      targetFormat,
      quality,
      compression,
    } = body as ConversionJob

    // Validate required fields
    if (!conversionId || !originalFileUrl || !sourceFormat || !targetFormat) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update conversion status to processing
    await supabase
      .from('conversions')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversionId)

    try {
      // Download original file from storage
      const filePath = originalFileUrl.split('/').slice(-2).join('/') // Extract path from URL
      const bucket = 'uploads' // Or get from URL
      const inputBuffer = await downloadFile(bucket, filePath)

      // Determine conversion type
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
        // Image to Image conversion
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
        })
      }

      // TODO: Trigger webhook if user has webhook configured
      // TODO: Send email notification
      // TODO: Log analytics event

      return NextResponse.json({
        success: true,
        conversionId,
        downloadUrl: outputUrl,
      })
    } catch (error: any) {
      // Update conversion status to failed
      await supabase
        .from('conversions')
        .update({
          status: 'failed',
          error_message: error.message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversionId)

      // TODO: Send error email to user

      throw error
    }
  } catch (error: any) {
    console.error('Conversion worker error:', error)
    return NextResponse.json(
      { error: error.message || 'Conversion failed' },
      { status: 500 }
    )
  }
}

/**
 * Add a conversion job to the queue
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const jobData: ConversionJob = {
      conversionId: body.conversionId,
      userId: body.userId || null,
      originalFileUrl: body.originalFileUrl,
      originalFileName: body.originalFileName,
      sourceFormat: body.sourceFormat,
      targetFormat: body.targetFormat,
      quality: body.quality,
      compression: body.compression,
      options: body.options,
    }

    const job = await addConversionJob(jobData)

    return NextResponse.json({
      success: true,
      jobId: job.id,
      conversionId: jobData.conversionId,
    })
  } catch (error: any) {
    console.error('Queue job creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to queue conversion' },
      { status: 500 }
    )
  }
}

