import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-neutral-medium-gray mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
              moved or doesn&apos;t exist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="primary" size="lg">
                  Go to Homepage
                </Button>
              </Link>
              <Link href="/convert">
                <Button variant="secondary" size="lg">
                  Start Converting
                </Button>
              </Link>
            </div>
            <div className="mt-12">
              <p className="text-sm text-neutral-medium-gray mb-4">
                Popular pages:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/pricing"
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/features"
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/formats"
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  Formats
                </Link>
                <Link
                  href="/support"
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

