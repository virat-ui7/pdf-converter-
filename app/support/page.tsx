import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Support - Get Help with File Converter',
  description:
    'Get help with file conversion, account issues, billing questions, and more. Browse FAQs or contact our support team.',
  keywords: 'file converter support, help, customer service, FAQ',
}

export default function SupportPage() {
  const supportOptions = [
    {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about file conversion, accounts, and billing.',
      icon: '❓',
      link: '/support/faq',
      linkText: 'View FAQ',
    },
    {
      title: 'Contact Us',
      description: 'Get in touch with our support team for personalized assistance.',
      icon: '📧',
      link: '/support/contact',
      linkText: 'Contact Support',
    },
    {
      title: 'API Documentation',
      description: 'Learn how to integrate our file conversion API into your applications.',
      icon: '📚',
      link: '/api/docs',
      linkText: 'View Docs',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">Support Center</h1>
            <p className="text-lg text-neutral-medium-gray max-w-2xl mx-auto">
              We&apos;re here to help! Find answers to your questions or get in touch with our team.
            </p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {supportOptions.map((option, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="text-4xl mb-4">{option.icon}</div>
                  <h2 className="text-xl font-semibold mb-3">{option.title}</h2>
                  <p className="text-neutral-medium-gray mb-6">{option.description}</p>
                  <Link href={option.link}>
                    <Button variant="primary" className="w-full">
                      {option.linkText}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Help Section */}
          <Card className="mb-12">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Quick Help</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Common Issues</h3>
                  <ul className="space-y-2 text-neutral-medium-gray">
                    <li>• File upload not working</li>
                    <li>• Conversion taking too long</li>
                    <li>• Format not supported</li>
                    <li>• Account access issues</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Response Times</h3>
                  <ul className="space-y-2 text-neutral-medium-gray">
                    <li>• Free tier: 24-48 hours</li>
                    <li>• Starter: 12-24 hours</li>
                    <li>• Professional: 2-4 hours</li>
                    <li>• Enterprise: 1 hour</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <p className="text-neutral-medium-gray mb-4">
              Still need help? We&apos;re here for you.
            </p>
            <Link href="/support/contact">
              <Button variant="primary" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

