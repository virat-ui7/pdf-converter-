import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About Us - File Converter',
  description:
    'Learn about File Converter, our mission to make file conversion easy and accessible for everyone.',
  keywords: 'about file converter, company, mission, team',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">About File Converter</h1>
            <p className="text-lg text-neutral-medium-gray max-w-2xl mx-auto">
              Making file conversion simple, fast, and accessible for everyone
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-12">
            <div className="p-8">
              <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-medium-gray leading-relaxed mb-4">
                At File Converter, we believe that file format conversion shouldn&apos;t be
                complicated or expensive. Our mission is to provide a fast, secure, and
                user-friendly platform that makes converting files between formats effortless.
              </p>
              <p className="text-lg text-neutral-medium-gray leading-relaxed">
                Whether you&apos;re a student, professional, or business, we&apos;re here to help
                you convert your files quickly and securely, without compromising on quality or
                privacy.
              </p>
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <div className="p-6">
                <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-neutral-medium-gray">
                  Your files are encrypted and automatically deleted after 24 hours. We never
                  store your data permanently.
                </p>
              </div>
            </Card>

            <Card className="text-center">
              <div className="p-6">
                <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-neutral-medium-gray">
                  Our optimized processing engine converts files in seconds, not minutes. Get
                  your converted files instantly.
                </p>
              </div>
            </Card>

            <Card className="text-center">
              <div className="p-6">
                <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">117 Formats</h3>
                <p className="text-neutral-medium-gray">
                  Support for documents, images, spreadsheets, and presentations. Convert between
                  any format you need.
                </p>
              </div>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg p-12 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10M+</div>
                <div className="text-orange-100">Files Converted</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-orange-100">Happy Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">117</div>
                <div className="text-orange-100">File Formats</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-orange-100">Uptime</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-neutral-medium-gray mb-6">
              Join thousands of users converting files every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/convert">
                <Button variant="primary" size="lg">
                  Start Converting
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="lg">
                  View Pricing
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

