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
import { Input } from '@/components/ui/Input'

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  last_used_at: string | null
  is_active: boolean
  created_at: string
}

interface Webhook {
  id: string
  url: string
  event_type: string
  is_active: boolean
  failed_attempts: number
  created_at: string
}

export default function ApiPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [showCreateWebhook, setShowCreateWebhook] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newWebhookUrl, setNewWebhookUrl] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard/api')
      return
    }

    if (status === 'authenticated') {
      fetchApiData()
    }
  }, [status, router])

  const fetchApiData = async () => {
    try {
      setIsLoading(true)

      const keysResponse = await fetch('/api/api-keys')
      if (keysResponse.ok) {
        const keysData = await keysResponse.json()
        setApiKeys(keysData.keys || [])
      }

      const webhooksResponse = await fetch('/api/webhooks')
      if (webhooksResponse.ok) {
        const webhooksData = await webhooksResponse.json()
        setWebhooks(webhooksData.webhooks || [])
      }
    } catch (error) {
      console.error('Failed to fetch API data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a key name')
      return
    }

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newKeyName }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`API Key created! Save this key now - you won't be able to see it again:\n\n${result.apiKey}`)
        setNewKeyName('')
        setShowCreateKey(false)
        fetchApiData()
      }
    } catch (error) {
      console.error('Failed to create API key:', error)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) {
      return
    }

    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchApiData()
      }
    } catch (error) {
      console.error('Failed to delete API key:', error)
    }
  }

  const handleCreateWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      alert('Please enter a webhook URL')
      return
    }

    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newWebhookUrl, eventType: 'conversion.completed' }),
      })

      if (response.ok) {
        setNewWebhookUrl('')
        setShowCreateWebhook(false)
        fetchApiData()
      }
    } catch (error) {
      console.error('Failed to create webhook:', error)
    }
  }

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) {
      return
    }

    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchApiData()
      }
    } catch (error) {
      console.error('Failed to delete webhook:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

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

  const user = session?.user as any
  const tier = user?.tier || 'free'
  const hasApiAccess = tier === 'professional' || tier === 'enterprise'

  if (!hasApiAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <Card className="p-12">
                <div className="text-4xl mb-4">🔑</div>
                <h1 className="text-2xl font-semibold mb-4">API Access Required</h1>
                <p className="text-neutral-medium-gray mb-6">
                  API access is available for Professional and Enterprise plans.
                  Upgrade your plan to access the API and webhooks.
                </p>
                <Link href="/pricing">
                  <Button variant="primary">Upgrade Plan</Button>
                </Link>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8">API & Webhooks</h1>

            {/* API Keys */}
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">API Keys</h2>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateKey(!showCreateKey)}
                >
                  Create API Key
                </Button>
              </div>

              {showCreateKey && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <Input
                    label="Key Name"
                    type="text"
                    placeholder="e.g., Production API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleCreateKey}>
                      Create
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowCreateKey(false)
                        setNewKeyName('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {apiKeys.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-medium-gray mb-4">
                    No API keys created yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <div className="font-medium mb-1">{key.name}</div>
                        <div className="text-sm text-neutral-medium-gray">
                          {key.key_prefix}••••••••
                        </div>
                        <div className="text-xs text-neutral-medium-gray mt-1">
                          Created {formatDate(key.created_at)}
                          {key.last_used_at &&
                            ` • Last used ${formatDate(key.last_used_at)}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={key.is_active ? 'success' : 'error'}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteKey(key.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Webhooks */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Webhooks</h2>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateWebhook(!showCreateWebhook)}
                >
                  Create Webhook
                </Button>
              </div>

              {showCreateWebhook && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <Input
                    label="Webhook URL"
                    type="url"
                    placeholder="https://your-domain.com/webhook"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleCreateWebhook}>
                      Create
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowCreateWebhook(false)
                        setNewWebhookUrl('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {webhooks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-medium-gray mb-4">
                    No webhooks configured yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div
                      key={webhook.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <div className="font-medium mb-1">{webhook.url}</div>
                        <div className="text-sm text-neutral-medium-gray">
                          Event: {webhook.event_type}
                        </div>
                        <div className="text-xs text-neutral-medium-gray mt-1">
                          Created {formatDate(webhook.created_at)}
                          {webhook.failed_attempts > 0 && (
                            <span className="text-red-600">
                              {' '}
                              • {webhook.failed_attempts} failed attempts
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={webhook.is_active ? 'success' : 'error'}>
                          {webhook.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

