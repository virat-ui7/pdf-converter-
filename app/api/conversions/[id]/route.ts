import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/get-session'
import { supabase } from '@/lib/supabase'
import { getJobStatus } from '@/lib/queue'

/**
 * Get conversion status by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    const conversionId = params.id

    // Get conversion from database
    const { data: conversion, error } = await supabase
      .from('conversions')
      .select('*')
      .eq('id', conversionId)
      .single()

    if (error || !conversion) {
      return NextResponse.json(
        { error: 'Conversion not found' },
        { status: 404 }
      )
    }

    // Check if user has access (if logged in)
    if (session?.user && conversion.user_id !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get job status from queue (if available)
    let jobStatus = null
    try {
      // Extract job ID from conversion metadata or use conversion ID
      // For now, we'll use the conversion ID as job identifier
      jobStatus = await getJobStatus(conversionId)
    } catch (err) {
      // Job might not exist in queue anymore (completed/failed)
      console.log('Job status not available:', err)
    }

    return NextResponse.json({
      id: conversion.id,
      status: conversion.status,
      originalFilename: conversion.original_filename,
      originalFormat: conversion.original_format,
      targetFormat: conversion.target_format,
      originalFileUrl: conversion.original_file_url,
      convertedFileUrl: conversion.converted_file_url,
      errorMessage: conversion.error_message,
      fileSize: conversion.file_size,
      createdAt: conversion.created_at,
      updatedAt: conversion.updated_at,
      jobStatus: jobStatus
        ? {
            state: jobStatus.state,
            progress: jobStatus.progress,
          }
        : null,
    })
  } catch (error: any) {
    console.error('Get conversion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Delete conversion
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const conversionId = params.id

    // Get conversion to verify ownership
    const { data: conversion, error: fetchError } = await supabase
      .from('conversions')
      .select('*')
      .eq('id', conversionId)
      .eq('user_id', (session.user as any).id)
      .single()

    if (fetchError || !conversion) {
      return NextResponse.json(
        { error: 'Conversion not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete files from storage
    const { deleteFile } = await import('@/lib/storage')
    try {
      if (conversion.original_file_url) {
        const originalPath = conversion.original_file_url.split('/').slice(-2).join('/')
        await deleteFile('uploads', originalPath)
      }
      if (conversion.converted_file_url) {
        const convertedPath = conversion.converted_file_url.split('/').slice(-2).join('/')
        await deleteFile('converted', convertedPath)
      }
    } catch (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue with DB deletion even if storage deletion fails
    }

    // Delete conversion record
    const { error: deleteError } = await supabase
      .from('conversions')
      .delete()
      .eq('id', conversionId)

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete conversion' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Conversion deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete conversion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

