import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ConversionPossibilities } from '@/components/converter/ConversionPossibilities'

export const metadata: Metadata = {
  title: 'Conversion Matrix - See All File Format Conversion Possibilities',
  description:
    'Explore all possible file format conversions. See what formats you can convert from PDF, Word, JPG, PNG, Excel, PowerPoint and 117 other formats.',
  keywords:
    'file converter, format converter, PDF to Word, JPG to PNG, conversion matrix, file format converter, document converter, image converter',
  openGraph: {
    title: 'Conversion Matrix - See All File Format Conversion Possibilities',
    description:
      'Explore all possible file format conversions. See what formats you can convert from PDF, Word, JPG, PNG, Excel, PowerPoint and 117 other formats.',
    url: 'https://www.fileconverter.com/conversion-matrix',
    siteName: 'File Converter',
    type: 'website',
  },
}

export default function ConversionMatrixPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-semibold mb-4">
                Conversion Matrix
              </h1>
              <p className="text-lg text-neutral-medium-gray max-w-2xl mx-auto">
                Explore all possible file format conversions. Select any format to see what you can
                convert it to, then click to start converting instantly.
              </p>
            </div>

            {/* Conversion Possibilities Component */}
            <ConversionPossibilities />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

