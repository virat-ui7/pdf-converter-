'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  // PhonePe doesn't require card details - handled separately
  // Card payment fields will be added when implementing card payment
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  plan: string
  currency: string
  amount: number
}

export function CheckoutForm({ plan, currency, amount }: CheckoutFormProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'card'>(
    currency === 'INR' ? 'phonepe' : 'card'
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)
    setError(null)

    try {
      if (paymentMethod === 'phonepe') {
        // PhonePe payment flow
        const response = await fetch('/api/payments/phonepe/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan,
            amount,
            currency: 'INR',
            email: data.email,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Payment initialization failed')
        }

        // Redirect to PhonePe payment page
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl
        }
      } else {
        // Card payment flow (will be implemented)
        // For now, show placeholder
        setError('Card payment integration will be implemented in next step')
        setIsProcessing(false)
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed')
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-6">Payment Details</h2>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-dark-gray mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('phonepe')}
            disabled={currency !== 'INR'}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              paymentMethod === 'phonepe'
                ? 'border-primary bg-primary-light'
                : 'border-gray-200 hover:border-gray-300'
            } ${currency !== 'INR' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-medium">PhonePe</div>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              paymentMethod === 'card'
                ? 'border-primary bg-primary-light'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="text-sm font-medium">Card</div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register('email')}
          required
        />

        {paymentMethod === 'card' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-neutral-medium-gray mb-4">
              Card payment integration will be implemented in the next step.
              For now, please use PhonePe for INR payments.
            </p>
            {/* Card fields will be added when implementing card payment */}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isProcessing}
        >
          {paymentMethod === 'phonepe'
            ? 'Pay with PhonePe'
            : 'Pay with Card'}
        </Button>

        <p className="text-xs text-center text-neutral-medium-gray">
          By proceeding, you agree to our{' '}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </Card>
  )
}

