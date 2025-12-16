'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FILE_FORMATS, getCompatibleFormats, getConversionCount, type FileFormat } from '@/lib/formats'
import { getConversionComplexity } from '@/lib/conversion-rules'
import { Input } from '@/components/ui/Input'

interface FormatSelectorProps {
  sourceFormat: FileFormat
  onFormatSelect: (format: FileFormat) => void
  selectedFormat?: FileFormat
}

export function FormatSelector({
  sourceFormat,
  onFormatSelect,
  selectedFormat,
}: FormatSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Get only supported target formats based on conversion rules
  const compatibleFormats = getCompatibleFormats(sourceFormat)
  const conversionCount = getConversionCount(sourceFormat.id)
  const filteredFormats = compatibleFormats.filter((format) =>
    format.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    format.extension.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-neutral-dark-gray">
          Convert to
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-medium-gray">
            {sourceFormat.name} → {conversionCount} format{conversionCount !== 1 ? 's' : ''}
          </span>
          <Link
            href={`/conversion-matrix?source=${sourceFormat.id}`}
            className="text-xs text-primary hover:text-primary-hover hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View All →
          </Link>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-primary transition-colors"
      >
        <span className="flex items-center">
          {selectedFormat ? (
            <>
              <span className="text-2xl mr-2">{selectedFormat.icon}</span>
              <span className="font-medium">{selectedFormat.name}</span>
              <span className="text-neutral-medium-gray ml-2">
                (.{selectedFormat.extension})
              </span>
            </>
          ) : (
            <span className="text-neutral-medium-gray">Select format...</span>
          )}
        </span>
        <svg
          className={`w-5 h-5 text-neutral-medium-gray transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <Input
                type="text"
                placeholder="Search formats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="overflow-y-auto max-h-80">
              {filteredFormats.length > 0 ? (
                <div className="py-2">
                  {filteredFormats.map((format) => {
                    const complexity = getConversionComplexity(sourceFormat.id, format.id)
                    // Estimate time based on complexity
                    const estimatedTime = complexity === 1 ? 5 : complexity === 2 ? 15 : complexity === 3 ? 60 : 120
                    // Determine quality based on format types
                    const isLossless = ['png', 'tiff', 'tif', 'bmp'].includes(format.id)
                    const quality = isLossless ? 'lossless' : complexity <= 2 ? 'high' : 'medium'
                    
                    return (
                      <button
                        key={format.id}
                        type="button"
                        onClick={() => {
                          onFormatSelect(format)
                          setIsOpen(false)
                          setSearchQuery('')
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center ${
                          selectedFormat?.id === format.id ? 'bg-primary-light' : ''
                        }`}
                      >
                        <span className="text-2xl mr-3">{format.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-neutral-dark-gray">
                            {format.name}
                          </div>
                          <div className="text-sm text-neutral-medium-gray">
                            .{format.extension}
                          </div>
                          <div className="text-xs text-neutral-medium-gray mt-1 flex items-center gap-2">
                            <span>~{estimatedTime}s</span>
                            <span>•</span>
                            <span className={`${
                              quality === 'lossless' ? 'text-green-600' :
                              quality === 'high' ? 'text-blue-600' :
                              quality === 'medium' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`}>
                              {quality}
                            </span>
                            {complexity >= 3 && (
                              <>
                                <span>•</span>
                                <span className="text-orange-600">Complex</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-neutral-medium-gray">
                  No formats found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

