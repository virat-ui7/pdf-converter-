'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FILE_FORMATS, FormatCategory } from '@/lib/formats'

export default function CategoryFormatsPage() {
  const params = useParams()
  const category = params.category as FormatCategory

  const categoryInfo: Record<FormatCategory, { name: string; icon: string; description: string }> = {
    document: {
      name: 'Document Formats',
      icon: '📝',
      description:
        'Convert between popular document formats including PDF, Word, text files, and more.',
    },
    image: {
      name: 'Image Formats',
      icon: '🖼️',
      description:
        'Convert between image formats including JPEG, PNG, WebP, SVG, and many more.',
    },
    spreadsheet: {
      name: 'Spreadsheet Formats',
      icon: '📊',
      description:
        'Convert between spreadsheet formats including Excel, CSV, and OpenDocument formats.',
    },
    presentation: {
      name: 'Presentation Formats',
      icon: '📽️',
      description:
        'Convert between presentation formats including PowerPoint and OpenDocument formats.',
    },
  }

  const validCategories: FormatCategory[] = ['document', 'image', 'spreadsheet', 'presentation']
  const isValidCategory = validCategories.includes(category)

  if (!isValidCategory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
            <p className="text-neutral-medium-gray mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Link href="/formats">
              <Button variant="primary">View All Formats</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const info = categoryInfo[category]
  const formats = FILE_FORMATS.filter((f) => f.category === category)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-orange-500 to-orange-600 text-white py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-4xl mb-6">{info.icon}</div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{info.name}</h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-50">{info.description}</p>
              <Link href="/convert">
                <Button variant="secondary" size="lg">
                  Start Converting
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Formats List */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <Link
                  href="/formats"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  ← Back to All Formats
                </Link>
              </div>

              <div className="mb-6">
                <p className="text-neutral-medium-gray">
                  {formats.length} format{formats.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formats.map((format) => (
                  <Card
                    key={format.id}
                    className="p-6 hover:shadow-lg transition-shadow text-center"
                  >
                    <div className="text-3xl mb-4">{format.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-neutral-black">
                      {format.name}
                    </h3>
                    <p className="text-sm text-neutral-medium-gray mb-4">
                      .{format.extension}
                    </p>
                    <p className="text-xs text-neutral-medium-gray">
                      {format.mimeType}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Conversion Examples */}
        <section className="py-16 bg-neutral-light-gray">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-neutral-black">
                Popular Conversions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formats.slice(0, 4).map((format) => (
                  <Card key={format.id} className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-2xl">{format.icon}</div>
                      <div>
                        <h3 className="font-semibold text-neutral-black">
                          Convert to/from {format.name}
                        </h3>
                        <p className="text-sm text-neutral-medium-gray">
                          .{format.extension}
                        </p>
                      </div>
                    </div>
                    <Link href="/convert">
                      <Button variant="primary" size="sm" className="w-full">
                        Convert Now
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Convert {info.name}?
              </h2>
              <p className="text-xl mb-8 text-orange-50">
                Start converting your files now. No signup required.
              </p>
              <Link href="/convert">
                <Button variant="secondary" size="lg">
                  Convert Files Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

