'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit
    if (!/^\d*$/.test(value)) return // Only allow numbers

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = async () => {
    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement verification API endpoint in Block 2
      // For now, this is a placeholder
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Invalid verification code')
        setIsLoading(false)
        return
      }

      // Redirect to login on success
      router.push('/auth/login?verified=true')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement resend API endpoint
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setTimeLeft(600) // Reset to 10 minutes
        setCanResend(false)
        setCode(['', '', '', '', '', ''])
        // Focus first input
        document.getElementById('code-0')?.focus()
      } else {
        const result = await response.json()
        setError(result.error || 'Failed to resend code')
      }
    } catch (err) {
      setError('Failed to resend verification code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light-gray px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-neutral-dark-gray mb-2">
              Verify Your Email
            </h1>
            <p className="text-base text-neutral-medium-gray">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-base font-medium text-neutral-dark-gray mt-1">
              {email || 'your email'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-dark-gray mb-3">
              Enter verification code
            </label>
            <div className="flex gap-3 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <p className="text-sm text-neutral-medium-gray">
              Code expires in:{' '}
              <span className="font-medium text-neutral-dark-gray">
                {formatTime(timeLeft)}
              </span>
            </p>
          </div>

          {/* Verify Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mb-4"
            onClick={handleVerify}
          >
            Verify Email
          </Button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-neutral-medium-gray mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              className={`text-sm font-medium ${
                canResend
                  ? 'text-primary hover:text-primary-hover'
                  : 'text-neutral-medium-gray cursor-not-allowed'
              }`}
            >
              {canResend ? 'Resend Code' : `Resend in ${formatTime(timeLeft)}`}
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:text-primary-hover"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-light-gray">
        <div className="text-center">
          <p className="text-neutral-medium-gray">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}

