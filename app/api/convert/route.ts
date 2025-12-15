import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'
import { generateFilePath } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    // Check authentication (optional - can allow anonymous conversions)
    // For now, we'll allow anonymous but track conversions for logged-in users

    const formData = await request.formData()
    const file = formData.get('file') as File
    const sourceFormat = formData.get('sourceFormat') as string
    const targetFormat = formData.get('targetFormat') as string

    if (!file || !sourceFormat || !targetFormat) {
      return NextResponse.json(
        { error: 'Missing required fields: file, sourceFormat, targetFormat' },
        { status: 400 }
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

    // Upload file to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const fileName = `${Date.now()}_${file.name}`
    const filePath = generateFilePath(session?.user?.id || null, fileName, 'uploads')
    
    const { uploadFile } = await import('@/lib/storage')
    const originalFileUrl = await uploadFile(
      'uploads',
      filePath,
      Buffer.from(fileBuffer),
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
  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

