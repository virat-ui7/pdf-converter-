import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PricingToggle } from '@/components/pricing/PricingToggle'
import { PricingCard } from '@/components/pricing/PricingCard'

export const metadata = {
  title: 'Pricing - FileConverter | Choose Your Plan',
  description:
    'Flexible pricing plans for individuals and businesses. Free tier available. Upgrade for more conversions and features.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-neutral-medium-gray max-w-2xl mx-auto mb-6">
              Choose the plan that fits your needs. All plans in USD. Secure payments accepted worldwide.
            </p>
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">30-Day Money-Back</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">No Hidden Fees</span>
              </div>
            </div>
          </div>

          {/* Pricing Toggle */}
          <PricingToggle />

          {/* Pricing Cards - USD Only */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Choose Your Plan</h2>
              <p className="text-neutral-medium-gray">
                All prices in USD. Accepted worldwide with secure payment processing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <PricingCard
                name="Free"
                price={0}
                currency="USD"
                period="month"
                conversions="200"
                fileSize="100MB"
                features={[
                  'Basic file conversions',
                  '100MB file size limit',
                  'Ad-supported experience',
                  'Email support',
                ]}
                ctaText="Get Started"
                ctaLink="/auth/signup"
                highlight={false}
              />
              <PricingCard
                name="Starter"
                price={4.99}
                currency="USD"
                period="month"
                conversions="1,000"
                fileSize="500MB"
                features={[
                  'Standard conversions',
                  '500MB file size limit',
                  'No advertisements',
                  'Priority processing',
                  'Email support',
                ]}
                ctaText="Choose Starter"
                ctaLink="/checkout?plan=starter&currency=USD"
                highlight={false}
              />
              <PricingCard
                name="Professional"
                price={14.99}
                currency="USD"
                period="month"
                conversions="10,000"
                fileSize="2GB"
                features={[
                  'Priority processing',
                  '2GB file size limit',
                  'API access',
                  'Webhook support',
                  'Batch processing',
                  'Priority support',
                ]}
                ctaText="Choose Professional"
                ctaLink="/checkout?plan=professional&currency=USD"
                highlight={true}
              />
              <PricingCard
                name="Enterprise"
                price={49.99}
                currency="USD"
                period="month"
                conversions="Unlimited"
                fileSize="Unlimited"
                features={[
                  'Unlimited conversions',
                  'Unlimited file size',
                  'White-label option',
                  '99.99% SLA',
                  'Dedicated support',
                  'Custom integrations',
                ]}
                ctaText="Contact Sales"
                ctaLink="/contact?plan=enterprise"
                highlight={false}
              />
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold text-center mb-8">
              Compare Plans
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-neutral-light-gray">
                    <th className="p-4 text-left font-semibold">Feature</th>
                    <th className="p-4 text-center font-semibold">Free</th>
                    <th className="p-4 text-center font-semibold">Starter</th>
                    <th className="p-4 text-center font-semibold">Professional</th>
                    <th className="p-4 text-center font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: 'Conversions per month',
                      free: '200',
                      starter: '1,000',
                      professional: '10,000',
                      enterprise: 'Unlimited',
                    },
                    {
                      feature: 'Max file size',
                      free: '100MB',
                      starter: '500MB',
                      professional: '2GB',
                      enterprise: 'Unlimited',
                    },
                    {
                      feature: 'Batch processing',
                      free: '❌',
                      starter: '❌',
                      professional: '✅',
                      enterprise: '✅',
                    },
                    {
                      feature: 'API access',
                      free: '❌',
                      starter: '❌',
                      professional: '✅',
                      enterprise: '✅',
                    },
                    {
                      feature: 'Webhooks',
                      free: '❌',
                      starter: '❌',
                      professional: '✅',
                      enterprise: '✅',
                    },
                    {
                      feature: 'White-label',
                      free: '❌',
                      starter: '❌',
                      professional: '❌',
                      enterprise: '✅',
                    },
                    {
                      feature: 'SLA guarantee',
                      free: '99%',
                      starter: '99.5%',
                      professional: '99.9%',
                      enterprise: '99.99%',
                    },
                    {
                      feature: 'Support',
                      free: 'Email',
                      starter: 'Email',
                      professional: 'Priority',
                      enterprise: 'Dedicated',
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="p-4 text-center">{row.free}</td>
                      <td className="p-4 text-center">{row.starter}</td>
                      <td className="p-4 text-center">{row.professional}</td>
                      <td className="p-4 text-center">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: 'Can I change plans later?',
                  answer:
                    'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  question: 'What payment methods do you accept?',
                  answer:
                    'For India: PhonePe. For international users: Visa, Mastercard, and American Express.',
                },
                {
                  question: 'Is there a free trial?',
                  answer:
                    'Yes! Our free tier includes 200 conversions per month with no credit card required.',
                },
                {
                  question: 'Do you offer annual billing?',
                  answer:
                    'Yes! Annual plans include a 20% discount. Toggle to "Annual" above to see pricing.',
                },
                {
                  question: 'What happens if I exceed my limit?',
                  answer:
                    'You can either upgrade your plan or wait until the next billing cycle. We\'ll notify you when you\'re close to your limit.',
                },
              ].map((faq, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-neutral-medium-gray">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg p-12">
            <h2 className="text-3xl font-semibold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-orange-50">
              Start converting files for free, no credit card required
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Sign Up Free
                </Button>
              </Link>
              <Link href="/convert">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-white border-white hover:bg-white/10"
                >
                  Try Converter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

