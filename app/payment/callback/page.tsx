'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

function PaymentCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const transactionId = searchParams.get('transactionId')
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (!transactionId) {
      setStatus('failed')
      setMessage('Invalid transaction ID')
      return
    }

    // Check payment status
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(
          `/api/payments/phonepe/status?transactionId=${transactionId}`
        )
        const result = await response.json()

        if (result.success && result.status === 'COMPLETED') {
          setStatus('success')
          setMessage('Payment successful! Your subscription is now active.')
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard?payment=success')
          }, 3000)
        } else {
          setStatus('failed')
          setMessage(result.message || 'Payment failed. Please try again.')
        }
      } catch (error) {
        setStatus('failed')
        setMessage('Unable to verify payment status. Please contact support.')
      }
    }

    checkPaymentStatus()
  }, [transactionId, router])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <Card className="text-center p-8">
              {status === 'loading' && (
                <>
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h1 className="text-2xl font-semibold mb-2">
                    Verifying Payment...
                  </h1>
                  <p className="text-neutral-medium-gray">
                    Please wait while we confirm your payment
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-semibold mb-2">
                    Payment Successful!
                  </h1>
                  <p className="text-neutral-medium-gray mb-6">{message}</p>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                </>
              )}

              {status === 'failed' && (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-semibold mb-2">
                    Payment Failed
                  </h1>
                  <p className="text-neutral-medium-gray mb-6">{message}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="primary"
                      onClick={() => router.push('/pricing')}
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => router.push('/support')}
                    >
                      Contact Support
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-medium-gray">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  )
}

