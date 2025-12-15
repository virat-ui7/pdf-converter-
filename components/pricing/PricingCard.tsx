'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface PricingCardProps {
  name: string
  price: number
  currency: 'USD' | 'INR'
  period: 'month' | 'year'
  conversions: string
  fileSize: string
  features: string[]
  ctaText: string
  ctaLink: string
  highlight?: boolean
}

export function PricingCard({
  name,
  price,
  currency,
  period,
  conversions,
  fileSize,
  features,
  ctaText,
  ctaLink,
  highlight = false,
}: PricingCardProps) {
  const currencySymbol = currency === 'USD' ? '$' : '₹'
  const displayPrice =
    price === 0
      ? 'Free'
      : period === 'year'
      ? `${currencySymbol}${(price * 12 * 0.8).toFixed(2)}`
      : `${currencySymbol}${price.toFixed(2)}`

  return (
    <Card
      className={`relative ${
        highlight
          ? 'border-2 border-primary shadow-lg scale-105'
          : 'hover:shadow-lg transition-shadow'
      }`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold mb-2">{name}</h3>
        <div className="mb-2">
          <span className="text-4xl font-bold text-primary">{displayPrice}</span>
          {price > 0 && (
            <span className="text-neutral-medium-gray ml-2">
              /{period === 'year' ? 'year' : 'month'}
            </span>
          )}
        </div>
        {period === 'year' && price > 0 && (
          <p className="text-sm text-neutral-medium-gray">
            {currencySymbol}
            {price.toFixed(2)}/month billed annually
          </p>
        )}
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-center">
          <span className="text-sm text-neutral-medium-gray mr-2">
            Conversions:
          </span>
          <span className="font-semibold">{conversions}</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-sm text-neutral-medium-gray mr-2">
            File size:
          </span>
          <span className="font-semibold">{fileSize}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
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
            <span className="text-sm text-neutral-dark-gray">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={ctaLink}>
        <Button
          variant={highlight ? 'primary' : 'secondary'}
          className="w-full"
          size="lg"
        >
          {ctaText}
        </Button>
      </Link>
    </Card>
  )
}

