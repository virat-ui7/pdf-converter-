'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">FC</span>
            </div>
            <span className="text-xl font-semibold text-neutral-dark-gray">
              FileConverter
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/pricing"
              className="text-base text-neutral-dark-gray hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/features"
              className="text-base text-neutral-dark-gray hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/blog"
              className="text-base text-neutral-dark-gray hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/formats"
              className="text-base text-neutral-dark-gray hover:text-primary transition-colors"
            >
              Formats
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-20 h-9 bg-gray-100 rounded animate-pulse"></div>
            ) : session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="md">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="md">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="md">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

