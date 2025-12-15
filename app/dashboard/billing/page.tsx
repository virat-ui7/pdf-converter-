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

interface Subscription {
  id: string
  plan_name: string
  planTier?: string
  plan_price_monthly: number
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  payment_status?: string
  start_date?: string
  end_date?: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  currency: string
  status: string
  planTier: string
  billingPeriod: {
    start: string
    end: string
  }
  createdAt: string
  paidAt: string | null
  downloadUrl: string
}

export default function BillingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCanceling, setIsCanceling] = useState(false)
  const [conversionsUsed, setConversionsUsed] = useState(0)
  const [conversionsLimit, setConversionsLimit] = useState(200)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard/billing')
      return
    }

    if (status === 'authenticated') {
      fetchBillingData()
    }
  }, [status, router])

  const fetchBillingData = async () => {
    try {
      setIsLoading(true)

      // Fetch subscription
      const subResponse = await fetch('/api/billing/subscription')
      if (subResponse.ok) {
        const subData = await subResponse.json()
        setSubscription(subData.subscription)
        if (subData.tier) {
          const limits = {
            free: 200,
            starter: 1000,
            professional: 10000,
            enterprise: Infinity,
          }
          setConversionsLimit(limits[subData.tier as keyof typeof limits] || 200)
        }
      }

      // Fetch usage stats
      const statsResponse = await fetch('/api/dashboard/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setConversionsUsed(statsData.conversionsUsed || 0)
      }

      // Fetch invoices
      const invoicesResponse = await fetch('/api/billing/invoices')
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json()
        setInvoices(invoicesData.invoices || [])
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
      return
    }

    try {
      setIsCanceling(true)
      const response = await fetch('/api/billing/cancel', {
        method: 'POST',
      })

      if (response.ok) {
        alert('Subscription canceled successfully. You will retain access until the end of your billing period.')
        fetchBillingData() // Refresh data
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Cancel subscription error:', error)
      alert('Failed to cancel subscription. Please try again.')
    } finally {
      setIsCanceling(false)
    }
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
  const tier = subscription?.plan_name?.toLowerCase() || user?.tier || 'free'
  const usagePercentage = (conversionsUsed / conversionsLimit) * 100

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8">Billing & Subscription</h1>

            {/* Current Plan */}
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
                  <Badge variant={tier === 'enterprise' ? 'info' : 'default'} className="capitalize">
                    {tier}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Link href="/pricing">
                    <Button variant="primary">Change Plan</Button>
                  </Link>
                </div>
              </div>

              {subscription ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-medium-gray">Plan Price</span>
                    <span className="font-semibold">
                      ${subscription.plan_price_monthly}/month
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-medium-gray">Status</span>
                    <Badge
                      variant={
                        subscription.status === 'active' ? 'success' : 'warning'
                      }
                    >
                      {subscription.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-medium-gray">Next Billing Date</span>
                    <span className="font-medium">
                      {formatDate(subscription.current_period_end)}
                    </span>
                  </div>
                  {subscription.cancel_at_period_end && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Your subscription will be canceled at the end of the current
                        billing period.
                      </p>
                    </div>
                  )}
                  {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                    <div className="mt-4">
                      <Button
                        variant="ghost"
                        onClick={handleCancelSubscription}
                        disabled={isCanceling}
                        className="text-error hover:text-error"
                      >
                        {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-medium-gray mb-4">
                    You're currently on the free plan
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Link href="/pricing">
                      <Button variant="primary">Upgrade Plan</Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>

            {/* Usage Tracker */}
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-6">Usage This Month</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Conversions</span>
                    <span className="text-sm text-neutral-medium-gray">
                      {conversionsUsed} / {conversionsLimit === Infinity ? '∞' : conversionsLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        usagePercentage > 80
                          ? 'bg-red-500'
                          : usagePercentage > 50
                          ? 'bg-yellow-500'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                  {usagePercentage > 80 && (
                    <p className="text-sm text-yellow-600 mt-2">
                      You're using {Math.round(usagePercentage)}% of your monthly limit.
                      Consider upgrading your plan.
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Payment Method</h2>
                {subscription && (
                  <Button variant="ghost" size="sm">
                    Update
                  </Button>
                )}
              </div>
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-neutral-medium-gray rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-light-gray rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-neutral-medium-gray"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-black">
                          {subscription.payment_status === 'paid' ? 'Card' : 'Payment Method'}
                        </p>
                        <p className="text-sm text-neutral-medium-gray">
                          Active payment method
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-sm text-neutral-medium-gray">
                    To update your payment method, please contact support or update it during your
                    next billing cycle.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-medium-gray mb-4">
                    Add a payment method when you subscribe to a plan
                  </p>
                  <Link href="/pricing">
                    <Button variant="primary">Subscribe Now</Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Invoices */}
            <Card>
              <h2 className="text-xl font-semibold mb-6">Invoices</h2>
              {invoices.length > 0 ? (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border border-neutral-medium-gray rounded-lg hover:bg-neutral-light-gray transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-neutral-black">
                            {invoice.invoiceNumber}
                          </span>
                          <Badge
                            variant={
                              invoice.status === 'paid' ? 'success' : 'warning'
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-medium-gray">
                          {invoice.planTier.charAt(0).toUpperCase() +
                            invoice.planTier.slice(1)}{' '}
                          Plan • {formatDate(invoice.createdAt)}
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-semibold text-neutral-black">
                          {invoice.currency} {invoice.amount}
                        </p>
                      </div>
                      <a
                        href={invoice.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-medium-gray">
                    {subscription
                      ? 'No invoices yet. Your first invoice will appear here after payment.'
                      : 'Invoice history will be available after your first payment'}
                  </p>
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

