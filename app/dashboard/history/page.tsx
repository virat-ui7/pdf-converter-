'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

interface Conversion {
  id: string
  original_filename: string
  original_format: string
  target_format: string
  status: string
  created_at: string
  file_size: number
  converted_file_url?: string
  error_message?: string
}

export default function ConversionHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    format: searchParams.get('format') || '',
    search: searchParams.get('search') || '',
  })

  const limit = 20

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard/history')
      return
    }

    if (status === 'authenticated') {
      fetchConversions()
    }
  }, [status, router, currentPage, filters])

  const fetchConversions = async () => {
    try {
      setIsLoading(true)
      const offset = (currentPage - 1) * limit
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.format && { format: filters.format }),
      })

      const response = await fetch(`/api/conversions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setConversions(data.conversions || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch conversions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (conversionId: string) => {
    if (!confirm('Are you sure you want to delete this conversion?')) {
      return
    }

    try {
      const response = await fetch(`/api/conversions/${conversionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchConversions()
      }
    } catch (error) {
      console.error('Failed to delete conversion:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'processing':
        return <Badge variant="info">Processing</Badge>
      case 'failed':
        return <Badge variant="error">Failed</Badge>
      default:
        return <Badge variant="warning">Queued</Badge>
    }
  }

  const totalPages = Math.ceil(total / limit)

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-medium-gray">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold mb-2">Conversion History</h1>
                <p className="text-neutral-medium-gray">
                  View and manage all your file conversions
                </p>
              </div>
              <Link href="/convert">
                <Button variant="primary">New Conversion</Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Search"
                type="text"
                placeholder="Search by filename..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
              <div>
                <label className="block text-sm font-medium text-neutral-dark-gray mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Status</option>
                  <option value="queued">Queued</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-dark-gray mb-2">
                  Format
                </label>
                <select
                  value={filters.format}
                  onChange={(e) =>
                    setFilters({ ...filters, format: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Formats</option>
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setFilters({ status: '', format: '', search: '' })
                  }
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Conversions Table */}
          <Card>
            {conversions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📄</div>
                <p className="text-neutral-medium-gray mb-4">
                  No conversions found
                </p>
                <Link href="/convert">
                  <Button variant="primary">Start Converting</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-dark-gray">
                          Filename
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-dark-gray">
                          Format
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-dark-gray">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-dark-gray">
                          Size
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-dark-gray">
                          Status
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-neutral-dark-gray">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversions.map((conversion) => (
                        <tr
                          key={conversion.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-sm">
                              {conversion.original_filename}
                            </div>
                            {conversion.error_message && (
                              <div className="text-xs text-red-600 mt-1">
                                {conversion.error_message}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-neutral-medium-gray">
                              {conversion.original_format.toUpperCase()} →{' '}
                              {conversion.target_format.toUpperCase()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-neutral-medium-gray">
                            {formatDate(conversion.created_at)}
                          </td>
                          <td className="py-3 px-4 text-sm text-neutral-medium-gray">
                            {formatFileSize(conversion.file_size)}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(conversion.status)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {conversion.status === 'completed' &&
                              conversion.converted_file_url ? (
                                <a
                                  href={conversion.converted_file_url}
                                  download
                                  className="text-primary hover:text-primary-hover text-sm font-medium"
                                >
                                  Download
                                </a>
                              ) : (
                                <span className="text-neutral-medium-gray text-sm">—</span>
                              )}
                              <button
                                onClick={() => handleDelete(conversion.id)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-neutral-medium-gray">
                      Showing {(currentPage - 1) * limit + 1} to{' '}
                      {Math.min(currentPage * limit, total)} of {total} conversions
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

