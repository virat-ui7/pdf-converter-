'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FILE_FORMATS, FormatCategory } from '@/lib/formats'

export default function FormatsPage() {
  const [selectedCategory, setSelectedCategory] = useState<FormatCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories: { id: FormatCategory | 'all'; name: string; icon: string; count: number }[] = [
    {
      id: 'all',
      name: 'All Formats',
      icon: '📄',
      count: FILE_FORMATS.length,
    },
    {
      id: 'document',
      name: 'Documents',
      icon: '📝',
      count: FILE_FORMATS.filter((f) => f.category === 'document').length,
    },
    {
      id: 'image',
      name: 'Images',
      icon: '🖼️',
      count: FILE_FORMATS.filter((f) => f.category === 'image').length,
    },
    {
      id: 'spreadsheet',
      name: 'Spreadsheets',
      icon: '📊',
      count: FILE_FORMATS.filter((f) => f.category === 'spreadsheet').length,
    },
    {
      id: 'presentation',
      name: 'Presentations',
      icon: '📽️',
      count: FILE_FORMATS.filter((f) => f.category === 'presentation').length,
    },
  ]

  const filteredFormats =
    selectedCategory === 'all'
      ? FILE_FORMATS
      : FILE_FORMATS.filter((f) => f.category === selectedCategory)

  const searchFilteredFormats = searchQuery
    ? filteredFormats.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.extension.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFormats

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-orange-500 to-orange-600 text-white py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                110+ Supported File Formats
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-50">
                Convert between documents, images, spreadsheets, and presentations
              </p>
              <Link href="/convert">
                <Button variant="secondary" size="lg">
                  Start Converting
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Category Filter & Search */}
        <section className="py-8 bg-white border-b border-neutral-medium-gray">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id as FormatCategory | 'all')
                      setSearchQuery('')
                    }}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white'
                        : 'bg-neutral-light-gray text-neutral-dark-gray hover:bg-neutral-medium-gray'
                    }`}
                  >
                    {category.icon} {category.name} ({category.count})
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search formats (e.g., PDF, JPG, DOCX)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Formats Grid */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              {searchFilteredFormats.length > 0 ? (
                <>
                  <div className="mb-6">
                    <p className="text-neutral-medium-gray">
                      Showing {searchFilteredFormats.length} format
                      {searchFilteredFormats.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchFilteredFormats.map((format) => (
                      <Card
                        key={format.id}
                        className="p-4 hover:shadow-lg transition-shadow text-center"
                      >
                        <div className="text-4xl mb-2">{format.icon}</div>
                        <h3 className="font-semibold text-neutral-black mb-1">
                          {format.name}
                        </h3>
                        <p className="text-sm text-neutral-medium-gray">
                          .{format.extension}
                        </p>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-medium-gray text-lg">
                    No formats found matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Category Links */}
        <section className="py-16 bg-neutral-light-gray">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-neutral-black">
                Browse by Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/formats/${category.id}`}
                      className="block"
                    >
                      <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="text-5xl mb-4">{category.icon}</div>
                        <h3 className="text-xl font-semibold mb-2 text-neutral-black">
                          {category.name}
                        </h3>
                        <p className="text-sm text-neutral-medium-gray">
                          {category.count} formats
                        </p>
                      </Card>
                    </Link>
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
                Ready to Convert?
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

