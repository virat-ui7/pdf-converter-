'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FILE_FORMATS, getFormatInfo, type FileFormat, type FormatCategory } from '@/lib/formats'
import { getConversionPossibilities, searchFormats } from '@/lib/conversion-matrix'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface ConversionPossibilitiesProps {
  initialSourceFormatId?: string
}

const categoryLabels: Record<FormatCategory, string> = {
  document: 'Documents',
  image: 'Images',
  spreadsheet: 'Spreadsheets',
  presentation: 'Presentations',
}

function ConversionPossibilitiesContent({ initialSourceFormatId }: ConversionPossibilitiesProps) {
  const searchParams = useSearchParams()
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    initialSourceFormatId || null
  )
  const [searchQuery, setSearchQuery] = useState('')

  // Handle query parameter for initial source format
  useEffect(() => {
    const sourceParam = searchParams.get('source')
    if (sourceParam && !initialSourceFormatId) {
      const format = getFormatInfo(sourceParam)
      if (format) {
        setSelectedSourceId(format.id)
      }
    }
  }, [searchParams, initialSourceFormatId])

  const possibilities = selectedSourceId
    ? getConversionPossibilities(selectedSourceId)
    : null

  const filteredFormats = searchQuery
    ? searchFormats(searchQuery)
    : FILE_FORMATS

  const handleFormatSelect = (formatId: string) => {
    setSelectedSourceId(formatId)
    setSearchQuery('')
  }

  const handleConvertClick = (targetFormatId: string) => {
    // Navigate to converter with pre-selected formats
    const params = new URLSearchParams({
      source: selectedSourceId || '',
      target: targetFormatId,
    })
    return `/convert?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      {/* Format Selector */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Select a format to see conversion possibilities
          </h2>

          {/* Search Bar */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search formats (e.g., PDF, Word, JPG)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Format Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
            {filteredFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => handleFormatSelect(format.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left hover:border-primary hover:shadow-md ${
                  selectedSourceId === format.id
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-3xl mb-2">{format.icon}</div>
                <div className="font-medium text-sm text-neutral-dark-gray">
                  {format.name}
                </div>
                <div className="text-xs text-neutral-medium-gray">
                  .{format.extension}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Conversion Possibilities Display */}
      {possibilities && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {possibilities.sourceFormat.icon}{' '}
                  {possibilities.sourceFormat.name} → Convert to:
                </h2>
                <p className="text-neutral-medium-gray">
                  {possibilities.totalCount} format{possibilities.totalCount !== 1 ? 's' : ''}{' '}
                  available
                </p>
              </div>
              <Link href="/convert">
                <Button variant="primary" size="md">
                  Go to Converter
                </Button>
              </Link>
            </div>

            {/* Target Formats by Category */}
            <div className="space-y-6">
              {(['document', 'image', 'spreadsheet', 'presentation'] as FormatCategory[]).map(
                (category) => {
                  const formats = possibilities.byCategory[category]
                  if (formats.length === 0) return null

                  return (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3 text-neutral-dark-gray">
                        {categoryLabels[category]} ({formats.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {formats.map((format) => (
                          <Link
                            key={format.id}
                            href={handleConvertClick(format.id)}
                            className="group"
                          >
                            <div className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-primary hover:shadow-md transition-all">
                              <div className="text-2xl mb-2">{format.icon}</div>
                              <div className="font-medium text-sm text-neutral-dark-gray group-hover:text-primary">
                                {format.name}
                              </div>
                              <div className="text-xs text-neutral-medium-gray">
                                .{format.extension}
                              </div>
                              <div className="mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Convert Now →
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!selectedSourceId && !searchQuery && (
        <Card>
          <div className="p-6 text-center">
            <p className="text-neutral-medium-gray">
              Select a format above to see all available conversion options
            </p>
          </div>
        </Card>
      )}

      {/* No Results */}
      {searchQuery && filteredFormats.length === 0 && (
        <Card>
          <div className="p-6 text-center">
            <p className="text-neutral-medium-gray">
              No formats found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export function ConversionPossibilities(props: ConversionPossibilitiesProps) {
  return (
    <Suspense fallback={
      <Card>
        <div className="p-6 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-medium-gray">Loading...</p>
        </div>
      </Card>
    }>
      <ConversionPossibilitiesContent {...props} />
    </Suspense>
  )
}

