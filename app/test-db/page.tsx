'use client'

import { useEffect, useState } from 'react'
import { testSupabaseConnection } from '@/lib/test-supabase'

export default function TestDB() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    testSupabaseConnection().then((success) => {
      setStatus(success ? 'success' : 'error')
      setMessage(success ? 'Database connected!' : 'Connection failed')
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <div className={`p-4 rounded ${
        status === 'success' ? 'bg-green-100 text-green-800' :
        status === 'error' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {status === 'loading' && 'Testing connection...'}
        {status === 'success' && '✅ ' + message}
        {status === 'error' && '❌ ' + message}
      </div>
    </div>
  )
}

