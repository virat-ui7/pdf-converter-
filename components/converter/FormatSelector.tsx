'use client'

import { useState } from 'react'
import { FILE_FORMATS, getCompatibleFormats, type FileFormat } from '@/lib/formats'
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

  const compatibleFormats = getCompatibleFormats(sourceFormat)
  const filteredFormats = compatibleFormats.filter((format) =>
    format.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    format.extension.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-neutral-dark-gray mb-2">
        Convert to
      </label>
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
                  {filteredFormats.map((format) => (
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
                      </div>
                    </button>
                  ))}
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

