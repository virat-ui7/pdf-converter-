'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { getFormatByExtension, formatFileSize, type FileFormat } from '@/lib/formats'
import { Card } from '@/components/ui/Card'

interface FileUploadProps {
  onFileSelect: (file: File, format: FileFormat) => void
  maxSize: number // in bytes
  acceptedFormats: string[]
}

export function FileUpload({
  onFileSelect,
  maxSize,
  acceptedFormats,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null)

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File size exceeds ${formatFileSize(maxSize)} limit`)
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('File type not supported. Please select a valid file format.')
        } else {
          setError(rejection.errors[0]?.message || 'File upload failed')
        }
        return
      }

      // Handle accepted file
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const extension = file.name.split('.').pop() || ''
        const format = getFormatByExtension(extension)

        if (!format) {
          setError(`Unsupported file format: .${extension}`)
          return
        }

        onFileSelect(file, format)
      }
    },
    [onFileSelect, maxSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFormats.reduce((acc, ext) => {
      const format = getFormatByExtension(ext)
      if (format) {
        acc[format.mimeType] = [`.${ext}`]
      }
      return acc
    }, {} as Record<string, string[]>),
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive || isDragging
              ? 'border-primary bg-primary-light'
              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg font-medium text-neutral-dark-gray mb-2">
            {isDragActive ? 'Drop your file here' : 'Drag and drop your file here'}
          </p>
          <p className="text-sm text-neutral-medium-gray mb-4">or</p>
          <button
            type="button"
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Browse Files
          </button>
          <p className="text-xs text-neutral-medium-gray mt-4">
            Maximum file size: {formatFileSize(maxSize)}
          </p>
          <p className="text-xs text-neutral-medium-gray">
            Supported formats: {acceptedFormats.join(', ').toUpperCase()}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
}

