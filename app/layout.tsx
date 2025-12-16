import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers/Providers'

export const metadata: Metadata = {
  title: {
    default: 'FileConverter - Convert 117 File Formats Instantly',
    template: '%s | FileConverter',
  },
  description:
    'Convert documents, images, spreadsheets, and presentations to 117 formats. Fast, secure, and free. No registration required.',
  keywords: [
    'file converter',
    'pdf converter',
    'image converter',
    'document converter',
    'online converter',
    'free converter',
  ],
  authors: [{ name: 'FileConverter' }],
  creator: 'FileConverter',
  publisher: 'FileConverter',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'FileConverter',
    title: 'FileConverter - Convert 117 File Formats Instantly',
    description:
      'Convert documents, images, spreadsheets, and presentations to 117 formats. Fast, secure, and free.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FileConverter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileConverter - Convert 117 File Formats Instantly',
    description:
      'Convert documents, images, spreadsheets, and presentations to 117 formats. Fast, secure, and free.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
