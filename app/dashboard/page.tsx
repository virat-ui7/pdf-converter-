'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface DashboardStats {
  conversionsUsed: number
  conversionsLimit: number
  storageUsed: number
  storageLimit: number
  apiCalls: number
  apiLimit: number
  tier: string
}

interface RecentConversion {
  id: string
  original_filename: string
  original_format: string
  target_format: string
  status: string
  created_at: string
  file_size: number
  converted_file_url?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentConversions, setRecentConversions] = useState<RecentConversion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard')
      return
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch user stats
      const statsResponse = await fetch('/api/dashboard/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch recent conversions
      const conversionsResponse = await fetch('/api/conversions?limit=5')
      if (conversionsResponse.ok) {
        const conversionsData = await conversionsResponse.json()
        setRecentConversions(conversionsData.conversions || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-medium-gray">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const user = session.user as any
  const tier = stats?.tier || user.tier || 'free'
  const conversionsUsed = stats?.conversionsUsed || user.conversionsUsed || 0
  const conversionsLimit = stats?.conversionsLimit || (tier === 'free' ? 200 : tier === 'starter' ? 1000 : tier === 'professional' ? 10000 : Infinity)

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container-custom">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
            <p className="text-neutral-medium-gray">
              Welcome back, {user.name || user.email}!
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-medium-gray">Conversions</span>
                <Badge variant={tier === 'enterprise' ? 'info' : 'default'}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </Badge>
              </div>
              <div className="text-2xl font-semibold mb-1">
                {conversionsUsed} / {conversionsLimit === Infinity ? '∞' : conversionsLimit}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((conversionsUsed / conversionsLimit) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              {tier !== 'enterprise' && (
                <Link href="/pricing" className="mt-3 block">
                  <Button variant="ghost" size="sm" className="w-full">
                    Upgrade Plan
                  </Button>
                </Link>
              )}
            </Card>

            <Card>
              <div className="text-sm text-neutral-medium-gray mb-2">Storage Used</div>
              <div className="text-2xl font-semibold mb-1">
                {formatFileSize((stats?.storageUsed || 0) * 1024 * 1024)}
              </div>
              <div className="text-sm text-neutral-medium-gray">
                of {formatFileSize((stats?.storageLimit || 5000) * 1024 * 1024)}
              </div>
            </Card>

            <Card>
              <div className="text-sm text-neutral-medium-gray mb-2">API Calls</div>
              <div className="text-2xl font-semibold mb-1">
                {stats?.apiCalls || 0} / {stats?.apiLimit || (tier === 'professional' || tier === 'enterprise' ? 1000 : 0)}
              </div>
              <div className="text-sm text-neutral-medium-gray">
                {tier === 'professional' || tier === 'enterprise' ? 'This month' : 'API not available'}
              </div>
            </Card>

            <Card>
              <div className="text-sm text-neutral-medium-gray mb-2">Plan</div>
              <div className="text-2xl font-semibold mb-1 capitalize">{tier}</div>
              <Link href="/dashboard/billing">
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  Manage Billing
                </Button>
              </Link>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/convert">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center p-6">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="font-semibold mb-2">Start New Conversion</h3>
                <p className="text-sm text-neutral-medium-gray">
                  Convert files to 110+ formats
                </p>
              </Card>
            </Link>

            {tier !== 'enterprise' && (
              <Link href="/pricing">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center p-6">
                  <div className="text-4xl mb-4">⬆️</div>
                  <h3 className="font-semibold mb-2">Upgrade Plan</h3>
                  <p className="text-sm text-neutral-medium-gray">
                    Get more conversions and features
                  </p>
                </Card>
              </Link>
            )}

            {(tier === 'professional' || tier === 'enterprise') && (
              <Link href="/dashboard/api">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center p-6">
                  <div className="text-4xl mb-4">🔑</div>
                  <h3 className="font-semibold mb-2">API Docs</h3>
                  <p className="text-sm text-neutral-medium-gray">
                    Access API documentation
                  </p>
                </Card>
              </Link>
            )}
          </div>

          {/* Recent Conversions */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Conversions</h2>
              <Link href="/dashboard/history">
                <Button variant="ghost" size="sm">
                  View All →
                </Button>
              </Link>
            </div>

            {recentConversions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📄</div>
                <p className="text-neutral-medium-gray mb-4">
                  No conversions yet
                </p>
                <Link href="/convert">
                  <Button variant="primary">Start Converting</Button>
                </Link>
              </div>
            ) : (
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
                    {recentConversions.map((conversion) => (
                      <tr
                        key={conversion.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-sm">
                            {conversion.original_filename}
                          </div>
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
                        <td className="py-3 px-4">{getStatusBadge(conversion.status)}</td>
                        <td className="py-3 px-4 text-right">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

