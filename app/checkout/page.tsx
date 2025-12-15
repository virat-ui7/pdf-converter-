'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const plan = searchParams.get('plan') || 'starter'
  const currency = searchParams.get('currency') || 'USD'

  const plans = {
    starter: {
      name: 'Starter',
      price: currency === 'INR' ? 49.99 : 4.99,
      conversions: '1,000',
      fileSize: '500MB',
    },
    professional: {
      name: 'Professional',
      price: currency === 'INR' ? 199.99 : 14.99,
      conversions: '10,000',
      fileSize: '2GB',
    },
    enterprise: {
      name: 'Enterprise',
      price: currency === 'INR' ? 399.99 : 49.99,
      conversions: 'Unlimited',
      fileSize: 'Unlimited',
    },
  }

  const selectedPlan = plans[plan as keyof typeof plans] || plans.starter

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/login?callbackUrl=/checkout?plan=${plan}&currency=${currency}`)
    }
  }, [status, router, plan, currency])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-medium-gray">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">
                Complete Your Purchase
              </h1>
              <p className="text-neutral-medium-gray">
                Review your plan and payment details
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <Card>
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{selectedPlan.name} Plan</p>
                        <p className="text-sm text-neutral-medium-gray">
                          {selectedPlan.conversions} conversions • {selectedPlan.fileSize} file size
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {currency === 'INR' ? '₹' : '$'}
                          {selectedPlan.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-neutral-medium-gray">/month</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-medium-gray">Subtotal</span>
                      <span className="font-semibold">
                        {currency === 'INR' ? '₹' : '$'}
                        {selectedPlan.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">
                        {currency === 'INR' ? '₹' : '$'}
                        {selectedPlan.price.toFixed(2)}/{currency === 'INR' ? 'month' : 'mo'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Payment Form */}
              <div>
                <CheckoutForm
                  plan={plan}
                  currency={currency}
                  amount={selectedPlan.price}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
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
      <CheckoutContent />
    </Suspense>
  )
}

