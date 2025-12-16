import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'
import { generateFilePath } from '@/lib/storage'
import { isConversionSupported } from '@/lib/conversion-rules'
import { getFormatInfo } from '@/lib/formats'
import { getMaxFileSize, validateFileSize, type UserTier } from '@/lib/file-limits'
import { validateFileFormat } from '@/lib/format-validation'
import { recordValidationRejection, recordAPIError } from '@/lib/monitoring/metrics-collector'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    // Check authentication (optional - can allow anonymous conversions)
    // For now, we'll allow anonymous but track conversions for logged-in users

    const formData = await request.formData()
    const file = formData.get('file') as File
    const sourceFormat = formData.get('sourceFormat') as string
    const targetFormat = formData.get('targetFormat') as string

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/convert/route.ts:15',message:'API convert request received',data:{hasFile:!!file,hasSourceFormat:!!sourceFormat,hasTargetFormat:!!targetFormat,fileSize:file?.size,fileName:file?.name},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (!file || !sourceFormat || !targetFormat) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/convert/route.ts:21',message:'Missing required fields',data:{hasFile:!!file,hasSourceFormat:!!sourceFormat,hasTargetFormat:!!targetFormat},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return NextResponse.json(
        { error: 'Missing required fields: file, sourceFormat, targetFormat' },
        { status: 400 }
      )
    }

    // Validate that the conversion is supported
    const isSupported = isConversionSupported(sourceFormat, targetFormat)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/convert/route.ts:28',message:'Conversion validation check',data:{sourceFormat,targetFormat,isSupported,fileSize:file.size,fileName:file.name},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (!isSupported) {
      const sourceFormatInfo = getFormatInfo(sourceFormat)
      const targetFormatInfo = getFormatInfo(targetFormat)
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/convert/route.ts:32',message:'Unsupported conversion rejected',data:{sourceFormat,targetFormat,sourceFormatName:sourceFormatInfo?.name,targetFormatName:targetFormatInfo?.name},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      // Record validation rejection metric
      await recordValidationRejection('unsupported', {
        source_format: sourceFormat,
        target_format: targetFormat,
      })
      
      return NextResponse.json(
        {
          error: `Conversion from ${sourceFormatInfo?.name || sourceFormat} to ${targetFormatInfo?.name || targetFormat} is not supported.`,
          sourceFormat: sourceFormatInfo?.name,
          targetFormat: targetFormatInfo?.name,
        },
        { status: 400 }
      )
    }

    // API-level file size validation
    const userTier = (session?.user as any)?.tier || 'free'
    const sizeValidation = validateFileSize(file.size, userTier as UserTier)
    
    if (!sizeValidation.valid) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/convert/route.ts:58',message:'File size validation failed',data:{fileSize:file.size,tier:userTier,maxSize:getMaxFileSize(userTier as UserTier),error:sizeValidation.error},timestamp:Date.now(),sessionId:'validation-fix',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Record validation rejection metric
      await recordValidationRejection('file_size', {
        file_size: file.size,
        tier: userTier,
        max_size: getMaxFileSize(userTier as UserTier),
      })
      
      return NextResponse.json(
        {
          error: sizeValidation.error || 'File size exceeds limit',
          fileSize: file.size,
          maxSize: getMaxFileSize(userTier as UserTier),
          tier: userTier,
        },
        { status: 413 } // 413 Payload Too Large
      )
    }

    // Check user tier limits
    if (session?.user) {
      const user = session.user as any
      const tier = user.tier || 'free'
      const conversionsUsed = user.conversionsUsed || 0

      const tierLimits = {
        free: 200,
        starter: 1000,
        professional: 10000,
        enterprise: Infinity,
      }

      if (conversionsUsed >= tierLimits[tier as keyof typeof tierLimits]) {
        return NextResponse.json(
          {
            error: 'Conversion limit reached. Please upgrade your plan.',
            upgradeRequired: true,
          },
          { status: 403 }
        )
      }
    }

    // Magic bytes validation - validate file content before processing
    const fileBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(fileBuffer)
    
    const formatValidation = await validateFileFormat(inputBuffer, sourceFormat)
    if (!formatValidation.valid) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/convert/route.ts:95',message:'Magic bytes validation failed',data:{sourceFormat,fileName:file.name,error:formatValidation.error},timestamp:Date.now(),sessionId:'validation-fix',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      // Record validation rejection metric
      await recordValidationRejection('magic_bytes', {
        source_format: sourceFormat,
        file_name: file.name,
      })
      
      return NextResponse.json(
        {
          error: formatValidation.error || 'File content does not match declared format',
          sourceFormat,
        },
        { status: 400 }
      )
    }

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}_${file.name}`
    const filePath = generateFilePath(session?.user?.id || null, fileName, 'uploads')
    
    const { uploadFile } = await import('@/lib/storage')
    const originalFileUrl = await uploadFile(
      'uploads',
      filePath,
      inputBuffer,
      file.type
    )

    // Create conversion record in database
    const { data: conversion, error: conversionError } = await supabase
      .from('conversions')
      .insert({
        user_id: session?.user?.id || null,
        original_filename: file.name,
        original_format: sourceFormat,
        target_format: targetFormat,
        original_file_url: originalFileUrl,
        status: 'queued',
        file_size: file.size,
      })
      .select()
      .single()

    if (conversionError) {
      console.error('Conversion record creation error:', conversionError)
      return NextResponse.json(
        { error: 'Failed to create conversion record' },
        { status: 500 }
      )
    }

    // Add job to queue
    const { addConversionJob } = await import('@/lib/queue')
    const job = await addConversionJob({
      conversionId: conversion.id,
      userId: session?.user?.id || null,
      originalFileUrl,
      originalFileName: file.name,
      sourceFormat,
      targetFormat,
      quality: 90, // Default quality
      compression: false,
    })

    return NextResponse.json({
      success: true,
      conversionId: conversion.id,
      jobId: job.id,
      status: 'queued',
      message: 'Conversion job queued successfully',
    })

    // Future implementation:
    // const fileBuffer = await file.arrayBuffer()
    // const fileName = `${Date.now()}_${file.name}`
    //
    // // Upload to Supabase Storage
    // const { data: uploadData, error: uploadError } = await supabase.storage
    //   .from('uploads')
    //   .upload(fileName, fileBuffer, {
    //     contentType: file.type,
    //   })
    //
    // if (uploadError) {
    //   return NextResponse.json(
    //     { error: 'Failed to upload file' },
    //     { status: 500 }
    //   )
    //
    // // Create conversion job
    // const { data: conversion, error: conversionError } = await supabase
    //   .from('conversions')
    //   .insert({
    //     user_id: session?.user?.id || null,
    //     source_format: sourceFormat,
    //     target_format: targetFormat,
    //     file_name: file.name,
    //     file_size: file.size,
    //     status: 'queued',
    //     storage_path: uploadData.path,
    //   })
    //   .select()
    //   .single()
    //
    // // Add to Bull queue
    // await conversionQueue.add('convert', {
    //   conversionId: conversion.id,
    //   sourceFormat,
    //   targetFormat,
    //   filePath: uploadData.path,
    // })
    //
    // return NextResponse.json({
    //   jobId: conversion.id,
    //   status: 'queued',
    //   estimatedTime: '30 seconds',
    // })
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/67abe3df-120c-48e7-afd8-a3813ecc9cd9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/convert/route.ts:168',message:'API error caught',data:{errorMessage:error?.message,errorType:error?.constructor?.name,hasStack:!!error?.stack},timestamp:Date.now(),sessionId:'qa-debug',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // Record API error metric
    await recordAPIError(500, '/api/convert', error?.message)
    
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

