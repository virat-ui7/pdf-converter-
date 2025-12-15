'use client'

import { useState } from 'react'

export function PricingToggle() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setBillingPeriod('monthly')}
          className={`px-6 py-2 rounded-md font-medium transition-all ${
            billingPeriod === 'monthly'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-medium-gray hover:text-neutral-dark-gray'
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBillingPeriod('annual')}
          className={`px-6 py-2 rounded-md font-medium transition-all relative ${
            billingPeriod === 'annual'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-medium-gray hover:text-neutral-dark-gray'
          }`}
        >
          Annual
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </button>
      </div>
    </div>
  )
}

