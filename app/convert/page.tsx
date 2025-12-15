'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FileUpload } from '@/components/converter/FileUpload'
import { FormatSelector } from '@/components/converter/FormatSelector'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getFormatByExtension, formatFileSize, type FileFormat } from '@/lib/formats'

type ConversionState = 'idle' | 'uploaded' | 'processing' | 'completed' | 'error'

export default function ConvertPage() {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [sourceFormat, setSourceFormat] = useState<FileFormat | null>(null)
  const [targetFormat, setTargetFormat] = useState<FileFormat | null>(null)
  const [state, setState] = useState<ConversionState>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  // Get user tier limits (default to free tier)
  const userTier = (session?.user as any)?.tier || 'free'
  const maxFileSize = {
    free: 100 * 1024 * 1024, // 100MB
    starter: 500 * 1024 * 1024, // 500MB
    professional: 2 * 1024 * 1024 * 1024, // 2GB
    enterprise: 10 * 1024 * 1024 * 1024, // 10GB
  }[userTier]

  const acceptedFormats = [
    'pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'html',
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff',
    'xlsx', 'xls', 'csv', 'ods',
    'pptx', 'ppt', 'odp',
  ]

  const handleFileSelect = (selectedFile: File, format: FileFormat) => {
    setFile(selectedFile)
    setSourceFormat(format)
    setTargetFormat(null)
    setState('uploaded')
    setError(null)
    setDownloadUrl(null)
  }

  const handleFormatSelect = (format: FileFormat) => {
    setTargetFormat(format)
  }

  const handleConvert = async () => {
    if (!file || !sourceFormat || !targetFormat) return

    setState('processing')
    setProgress(0)
    setError(null)

    // Simulate progress (will be replaced with real conversion in Block 5)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      // TODO: Replace with actual conversion API call in Block 5
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sourceFormat', sourceFormat.id)
      formData.append('targetFormat', targetFormat.id)

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Conversion failed')
      }

      const result = await response.json()
      setDownloadUrl(result.downloadUrl || '#')
      setState('completed')
    } catch (err: any) {
      setError(err.message || 'Conversion failed. Please try again.')
      setState('error')
      clearInterval(progressInterval)
    }
  }

  const handleReset = () => {
    setFile(null)
    setSourceFormat(null)
    setTargetFormat(null)
    setState('idle')
    setProgress(0)
    setError(null)
    setDownloadUrl(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">
                Convert Your Files
              </h1>
              <p className="text-neutral-medium-gray">
                Upload a file and select your desired output format
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upload Area */}
                {state === 'idle' && (
                  <Card>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      maxSize={maxFileSize}
                      acceptedFormats={acceptedFormats}
                    />
                  </Card>
                )}

                {/* File Details */}
                {state === 'uploaded' && file && sourceFormat && (
                  <Card>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">File Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{sourceFormat.icon}</span>
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-neutral-medium-gray">
                                  {formatFileSize(file.size)} • {sourceFormat.name}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={handleReset}
                              className="text-sm text-primary hover:text-primary-hover"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>

                      <FormatSelector
                        sourceFormat={sourceFormat}
                        onFormatSelect={handleFormatSelect}
                        selectedFormat={targetFormat}
                      />

                      {targetFormat && (
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full"
                          onClick={handleConvert}
                        >
                          Convert to {targetFormat.name}
                        </Button>
                      )}
                    </div>
                  </Card>
                )}

                {/* Processing */}
                {state === 'processing' && (
                  <Card>
                    <div className="text-center py-8">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold mb-2">Converting...</h3>
                      <p className="text-neutral-medium-gray mb-4">
                        This may take a few moments
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-neutral-medium-gray mt-2">
                        {progress}% complete
                      </p>
                    </div>
                  </Card>
                )}

                {/* Completed */}
                {state === 'completed' && downloadUrl && (
                  <Card>
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Conversion Complete!</h3>
                      <p className="text-neutral-medium-gray mb-6">
                        Your file has been converted successfully
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href={downloadUrl} download>
                          <Button variant="primary" size="lg" className="w-full sm:w-auto">
                            Download File
                          </Button>
                        </a>
                        <Button
                          variant="secondary"
                          size="lg"
                          className="w-full sm:w-auto"
                          onClick={handleReset}
                        >
                          Convert Another
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Error */}
                {state === 'error' && error && (
                  <Card>
                    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-red-800 mb-2">
                        Conversion Failed
                      </h3>
                      <p className="text-red-700 mb-4">{error}</p>
                      <Button variant="primary" onClick={handleReset}>
                        Try Again
                      </Button>
                    </div>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Tier Info (if logged in) */}
                {session && (
                  <Card>
                    <h3 className="font-semibold mb-4">Your Plan</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-medium-gray">
                          Tier:
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {(session.user as any)?.tier || 'Free'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-medium-gray">
                          Conversions:
                        </span>
                        <span className="text-sm font-medium">
                          {(session.user as any)?.conversionsUsed || 0} /{' '}
                          {userTier === 'free'
                            ? '200'
                            : userTier === 'starter'
                            ? '1,000'
                            : userTier === 'professional'
                            ? '10,000'
                            : '∞'}
                        </span>
                      </div>
                      {userTier === 'free' && (
                        <Button variant="primary" size="sm" className="w-full mt-4">
                          Upgrade Plan
                        </Button>
                      )}
                    </div>
                  </Card>
                )}

                {/* Info Card */}
                <Card>
                  <h3 className="font-semibold mb-4">Need Help?</h3>
                  <p className="text-sm text-neutral-medium-gray mb-4">
                    Check out our{' '}
                    <a href="/how-it-works" className="text-primary hover:underline">
                      guide
                    </a>{' '}
                    or contact{' '}
                    <a href="/support" className="text-primary hover:underline">
                      support
                    </a>
                    .
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

