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
import { convertSpreadsheet } from '../lib/converters/spreadsheet'
import { convertPresentation } from '../lib/converters/presentation'
import { convertProgrammingToTxt } from '../lib/converters/programming'
import { convertEML, convertMSG } from '../lib/converters/email'
import { convertICSToVCS, convertVCSToICS, convertVCFToCSV, convertVCFToJSON } from '../lib/converters/calendar'
import { convertEbook } from '../lib/converters/ebook'
import { convertRAW } from '../lib/converters/raw'
import { convertSVG, convertEPS, convertEMF } from '../lib/converters/vector'
import { convertPSD, convertAI, convertDjVu, convertJPEG2000, convertCorelDRAW, convertFPX } from '../lib/converters/professional'
import { convertLegacyImage } from '../lib/converters/legacy-image'
import { getFormatByExtension } from '../lib/formats'
import { validateFileSize, getMaxFileSize, type UserTier } from '../lib/file-limits'
import { validateFileFormat } from '../lib/format-validation'
import { isConversionSupported } from '../lib/conversion-rules'
import { recordConversionMetric, recordSecurityEvent } from '../lib/monitoring/metrics-collector'

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

    const normalizedSource = sourceFormat.toLowerCase()
    const normalizedTarget = targetFormat.toLowerCase()

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:44',message:'Conversion job started',data:{conversionId,sourceFormat,targetFormat,normalizedSource,normalizedTarget},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

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

    // ============================================
    // WORKER-LEVEL VALIDATION (Defense-in-depth)
    // ============================================
    
    // 1. Re-check file size (catches if API check was bypassed)
    const { data: conversionRecord } = await supabase
      .from('conversions')
      .select('file_size, user_id')
      .eq('id', conversionId)
      .single()

    if (conversionRecord) {
      // Get user tier for size validation
      let userTier: UserTier = 'free'
      if (userId) {
        const { data: user } = await supabase
          .from('users')
          .select('tier')
          .eq('id', userId)
          .single()
        if (user?.tier) {
          userTier = user.tier as UserTier
        }
      }

      const fileSize = inputBuffer.length
      const sizeValidation = validateFileSize(fileSize, userTier)
      
      if (!sizeValidation.valid) {
        console.error(`[Worker] File size validation failed for conversion ${conversionId}: ${sizeValidation.error}`)
        await supabase
          .from('conversions')
          .update({
            status: 'failed',
            error_message: sizeValidation.error || 'File size exceeds tier limit',
            updated_at: new Date().toISOString(),
          })
          .eq('id', conversionId)
        throw new Error(`File size validation failed: ${sizeValidation.error}`)
      }
    }

    // 2. Re-validate magic bytes (catches if file was corrupted during upload)
    const formatValidation = await validateFileFormat(inputBuffer, sourceFormat)
    if (!formatValidation.valid) {
      console.error(`[Worker] Magic bytes validation failed for conversion ${conversionId}: ${formatValidation.error}`)
      await supabase
        .from('conversions')
        .update({
          status: 'failed',
          error_message: formatValidation.error || 'File content does not match declared format',
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversionId)
      throw new Error(`Format validation failed: ${formatValidation.error}`)
    }

    // 3. Re-check source/target format pair is in conversion matrix
    if (!isConversionSupported(sourceFormat, targetFormat)) {
      console.error(`[Worker] Unsupported conversion for ${conversionId}: ${sourceFormat} → ${targetFormat}`)
      await supabase
        .from('conversions')
        .update({
          status: 'failed',
          error_message: `Conversion from ${sourceFormat} to ${targetFormat} is not supported`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversionId)
      throw new Error(`Unsupported conversion: ${sourceFormat} → ${targetFormat}`)
    }

    // Get format info
    const sourceFormatInfo = getFormatByExtension(sourceFormat)
    const targetFormatInfo = getFormatByExtension(targetFormat)

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:62',message:'Format info retrieved',data:{sourceFormatInfo:sourceFormatInfo?{id:sourceFormatInfo.id,category:sourceFormatInfo.category,mimeType:sourceFormatInfo.mimeType}:null,targetFormatInfo:targetFormatInfo?{id:targetFormatInfo.id,category:targetFormatInfo.category,mimeType:targetFormatInfo.mimeType}:null},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (!sourceFormatInfo || !targetFormatInfo) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:67',message:'Invalid format error',data:{sourceFormat,targetFormat,sourceFormatInfo:!!sourceFormatInfo,targetFormatInfo:!!targetFormatInfo},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      throw new Error('Invalid format')
    }

    let convertedBuffer: Buffer
    let routingHandler = 'unknown'

    // Route to appropriate converter based on source format
    // Check for programming formats first (they all convert to TXT)
    const programmingFormats = ['bas', 'asm', 'cbl', 'vbp', 'pas', 'apa', 'bet', 'asc']
    if (programmingFormats.includes(normalizedSource) && normalizedTarget === 'txt') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:74',message:'Routing to programming converter',data:{sourceFormat:normalizedSource,targetFormat:normalizedTarget},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      routingHandler = 'programming'
      // Programming format to TXT
      convertedBuffer = await convertProgrammingToTxt(inputBuffer, sourceFormat)
    }
    // Check for email formats
    else if (normalizedSource === 'eml') {
      const { convertEML } = await import('../lib/converters/email')
      convertedBuffer = await convertEML(inputBuffer, targetFormat)
    } else if (normalizedSource === 'msg') {
      const { convertMSG } = await import('../lib/converters/email')
      convertedBuffer = await convertMSG(inputBuffer, targetFormat)
    }
    // Check for calendar formats
    else if (normalizedSource === 'ics' && normalizedTarget === 'vcs') {
      const { convertICSToVCS } = await import('../lib/converters/calendar')
      convertedBuffer = await convertICSToVCS(inputBuffer)
    } else if (normalizedSource === 'vcs' && normalizedTarget === 'ics') {
      const { convertVCSToICS } = await import('../lib/converters/calendar')
      convertedBuffer = await convertVCSToICS(inputBuffer)
    } else if (normalizedSource === 'vcf' && normalizedTarget === 'csv') {
      const { convertVCFToCSV } = await import('../lib/converters/calendar')
      convertedBuffer = await convertVCFToCSV(inputBuffer)
    } else if (normalizedSource === 'vcf' && normalizedTarget === 'json') {
      const { convertVCFToJSON } = await import('../lib/converters/calendar')
      convertedBuffer = await convertVCFToJSON(inputBuffer)
    }
    // Check for eBook formats
    else if (['epub', 'mobi', 'prc'].includes(normalizedSource)) {
      const { convertEbook } = await import('../lib/converters/ebook')
      convertedBuffer = await convertEbook(inputBuffer, sourceFormat, targetFormat)
    }
    // Check for specialized document formats
    else if (['one', 'chm', 'tex', 'xmind', 'pst', 'sdf', 'ini'].includes(normalizedSource)) {
      const { convertSpecializedDoc } = await import('../lib/converters/specialized-doc')
      convertedBuffer = await convertSpecializedDoc(inputBuffer, sourceFormat, targetFormat)
    }
    // Check for Keynote format
    else if (normalizedSource === 'key') {
      const { convertKeynote } = await import('../lib/converters/presentation')
      convertedBuffer = await convertKeynote(inputBuffer, targetFormat)
    }
    // Check for RAW formats
    else if (['raw', 'dng', 'nef', 'orf', 'pef', 'raf', 'cr2', 'crw', 'arw', 'sfw', 'kdc'].includes(normalizedSource)) {
      const { convertRAW } = await import('../lib/converters/raw')
      convertedBuffer = await convertRAW(inputBuffer, sourceFormat, targetFormat, {
        quality: quality || 90,
      })
    }
    // Check for vector formats
    else if (['svg', 'svgz'].includes(normalizedSource)) {
      const { convertSVG } = await import('../lib/converters/vector')
      convertedBuffer = await convertSVG(inputBuffer, targetFormat)
    } else if (normalizedSource === 'eps') {
      const { convertEPS } = await import('../lib/converters/vector')
      convertedBuffer = await convertEPS(inputBuffer, targetFormat)
    } else if (['emf', 'wmf'].includes(normalizedSource)) {
      const { convertEMF } = await import('../lib/converters/vector')
      convertedBuffer = await convertEMF(inputBuffer, targetFormat)
    }
    // Check for professional design formats
    else if (normalizedSource === 'psd') {
      const { convertPSD } = await import('../lib/converters/professional')
      convertedBuffer = await convertPSD(inputBuffer, targetFormat)
    } else if (normalizedSource === 'ai') {
      const { convertAI } = await import('../lib/converters/professional')
      convertedBuffer = await convertAI(inputBuffer, targetFormat)
    } else if (normalizedSource === 'djvu') {
      const { convertDjVu } = await import('../lib/converters/professional')
      convertedBuffer = await convertDjVu(inputBuffer, targetFormat)
    } else if (['jp2', 'jpx'].includes(normalizedSource)) {
      const { convertJPEG2000 } = await import('../lib/converters/professional')
      convertedBuffer = await convertJPEG2000(inputBuffer, sourceFormat, targetFormat)
    } else if (['cdr', 'cmx'].includes(normalizedSource)) {
      const { convertCorelDRAW } = await import('../lib/converters/professional')
      convertedBuffer = await convertCorelDRAW(inputBuffer, sourceFormat, targetFormat)
    } else if (normalizedSource === 'fpx') {
      const { convertFPX } = await import('../lib/converters/professional')
      convertedBuffer = await convertFPX(inputBuffer, targetFormat)
    }
    // Check for legacy image formats
    else if (['pcx', 'rle', 'dib', 'wbmp', 'pcd', 'pgm', 'pict', 'tga', 'xcf', 'yuv', 'hdr'].includes(normalizedSource)) {
      const { convertLegacyImage } = await import('../lib/converters/legacy-image')
      convertedBuffer = await convertLegacyImage(inputBuffer, sourceFormat, targetFormat)
    }
    // Check for modern image formats (HEIC, HEIF, AVIF, FLIF)
    else if (['heic', 'heif'].includes(normalizedSource)) {
      // HEIC/HEIF conversion - use heic-convert library or Sharp
      try {
        const heicConvert = await import('heic-convert')
        const converted = await heicConvert.default({
          buffer: inputBuffer,
          format: normalizedTarget === 'jpg' || normalizedTarget === 'jpeg' ? 'JPEG' : 'PNG',
          quality: quality || 0.92,
        })
        convertedBuffer = Buffer.from(converted)
      } catch (error: any) {
        // Fallback to Sharp if heic-convert fails
        convertedBuffer = await convertImage(inputBuffer, sourceFormat, targetFormat, {
          quality: quality || 90,
          compression: compression || false,
        })
      }
    } else if (normalizedSource === 'avif') {
      // AVIF is supported by Sharp
      convertedBuffer = await convertImage(inputBuffer, sourceFormat, targetFormat, {
        quality: quality || 90,
        compression: compression || false,
      })
    } else if (normalizedSource === 'flif') {
      // FLIF conversion - would need flif library
      // For now, try Sharp (may not work)
      convertedBuffer = await convertImage(inputBuffer, sourceFormat, targetFormat, {
        quality: quality || 90,
        compression: compression || false,
      })
    }
    // Standard image conversions
    else if (sourceFormatInfo.category === 'image') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:191',message:'Routing to image converter',data:{sourceFormat:normalizedSource,targetFormat:normalizedTarget,category:sourceFormatInfo.category},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      routingHandler = 'image'
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
    } else if (sourceFormatInfo.category === 'document') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:203',message:'Routing to document converter',data:{sourceFormat:normalizedSource,targetFormat:normalizedTarget,category:sourceFormatInfo.category},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      routingHandler = 'document'
      // Document conversion
      convertedBuffer = await convertDocument(
        inputBuffer,
        sourceFormat,
        targetFormat,
        {
          quality: quality,
        }
      )
    } else if (sourceFormatInfo.category === 'spreadsheet') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:214',message:'Routing to spreadsheet converter',data:{sourceFormat:normalizedSource,targetFormat:normalizedTarget,category:sourceFormatInfo.category},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      routingHandler = 'spreadsheet'
      // Spreadsheet conversion
      convertedBuffer = await convertSpreadsheet(
        inputBuffer,
        sourceFormat,
        targetFormat,
        {
          quality: quality,
        }
      )
    } else if (sourceFormatInfo.category === 'presentation') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:225',message:'Routing to presentation converter',data:{sourceFormat:normalizedSource,targetFormat:normalizedTarget,category:sourceFormatInfo.category},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      routingHandler = 'presentation'
      // Presentation conversion
      convertedBuffer = await convertPresentation(
        inputBuffer,
        sourceFormat,
        targetFormat,
        {
          quality: quality,
        }
      )
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:236',message:'Unsupported conversion category',data:{sourceFormat:normalizedSource,targetFormat:normalizedTarget,category:sourceFormatInfo.category},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      throw new Error(
        `Conversion from ${sourceFormat} to ${targetFormat} is not supported. Category: ${sourceFormatInfo.category}`
      )
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:238',message:'Conversion completed',data:{routingHandler,outputSize:convertedBuffer.length,sourceFormat:normalizedSource,targetFormat:normalizedTarget},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

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

    // Record conversion success metric
    const processingTime = job.processedOn ? (Date.now() - job.processedOn) / 1000 : undefined
    await recordConversionMetric(
      sourceFormat,
      targetFormat,
      'success',
      processingTime
    )

    console.log(`✅ Conversion ${conversionId} completed: ${outputUrl}`)

    return {
      success: true,
      conversionId,
      downloadUrl: outputUrl,
    }
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'start-worker.ts:317',message:'Conversion failed',data:{conversionId,sourceFormat:normalizedSource,targetFormat:normalizedTarget,errorMessage:error.message,errorType:error.constructor.name,hasStack:!!error.stack},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    console.error(`❌ Conversion ${conversionId} failed:`, error.message)

    // Update status to failed
    // Sanitize error message - only expose user-friendly validation errors
    const sanitizedErrorMessage = 
      error.message?.includes('File size') || 
      error.message?.includes('format') || 
      error.message?.includes('conversion') || 
      error.message?.includes('validation')
        ? error.message // User-friendly validation errors
        : 'Conversion failed. Please try again or contact support if the issue persists.'
    
    await supabase
      .from('conversions')
      .update({
        status: 'failed',
        error_message: sanitizedErrorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversionId)

    // Record conversion failure metric
    const processingTime = job.processedOn ? (Date.now() - job.processedOn) / 1000 : undefined
    await recordConversionMetric(
      sourceFormat,
      targetFormat,
      'failure',
      processingTime,
      sanitizedErrorMessage
    )

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

