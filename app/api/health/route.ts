import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const startTime = Date.now()

export async function GET() {
  try {
    // Check database connection
    const { error: dbError } = await supabase.from('users').select('id').limit(1)

    // Calculate uptime
    const uptime = Math.floor((Date.now() - startTime) / 1000) // in seconds

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptime,
        formatted: formatUptime(uptime),
      },
      services: {
        database: dbError ? 'error' : 'ok',
        storage: 'ok', // Supabase storage is part of the same service
      },
      version: process.env.npm_package_version || '1.0.0',
    }

    // If database is down, return 503
    if (dbError) {
      return NextResponse.json(
        {
          ...health,
          status: 'degraded',
          error: 'Database connection failed',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    )
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

