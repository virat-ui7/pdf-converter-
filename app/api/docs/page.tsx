import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export const metadata = {
  title: 'API Documentation - FileConverter',
  description: 'Complete API documentation for FileConverter. Convert files programmatically with our REST API.',
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-semibold mb-4">API Documentation</h1>
              <p className="text-lg text-neutral-medium-gray">
                Convert files programmatically using our REST API
              </p>
              <div className="mt-4">
                <Badge variant="info">Professional & Enterprise Only</Badge>
              </div>
            </div>

            {/* Authentication */}
            <Card className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
              <p className="text-neutral-medium-gray mb-4">
                All API requests require authentication using an API key. Include your API key in the request header:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <code>Authorization: Bearer YOUR_API_KEY</code>
              </div>
              <p className="text-sm text-neutral-medium-gray mt-4">
                Get your API key from{' '}
                <a href="/dashboard/api" className="text-primary hover:underline">
                  Dashboard → API & Webhooks
                </a>
              </p>
            </Card>

            {/* Base URL */}
            <Card className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Base URL</h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <code>{process.env.NEXTAUTH_URL || 'https://fileconverter.com'}/api/v1</code>
              </div>
            </Card>

            {/* Convert File */}
            <Card className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Convert File</h2>
              <p className="text-neutral-medium-gray mb-4">
                Convert a file from one format to another.
              </p>

              <div className="mb-4">
                <Badge variant="default" className="mb-2">POST</Badge>
                <code className="ml-2 text-sm">/convert</code>
              </div>

              <h3 className="font-semibold mb-2">Request</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                <pre>{`{
  "file": "<base64_encoded_file>",
  "sourceFormat": "docx",
  "targetFormat": "pdf",
  "quality": 90,
  "compression": false
}`}</pre>
              </div>

              <h3 className="font-semibold mb-2">Response</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "success": true,
  "conversionId": "uuid",
  "status": "queued",
  "estimatedTime": "30 seconds"
}`}</pre>
              </div>
            </Card>

            {/* Get Conversion Status */}
            <Card className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Get Conversion Status</h2>
              <p className="text-neutral-medium-gray mb-4">
                Check the status of a conversion.
              </p>

              <div className="mb-4">
                <Badge variant="default" className="mb-2">GET</Badge>
                <code className="ml-2 text-sm">/conversions/:id</code>
              </div>

              <h3 className="font-semibold mb-2">Response</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "id": "uuid",
  "status": "completed",
  "originalFilename": "document.docx",
  "convertedFileUrl": "https://...",
  "createdAt": "2025-01-01T00:00:00Z"
}`}</pre>
              </div>
            </Card>

            {/* List Conversions */}
            <Card className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">List Conversions</h2>
              <p className="text-neutral-medium-gray mb-4">
                Get a list of your conversions with optional filters.
              </p>

              <div className="mb-4">
                <Badge variant="default" className="mb-2">GET</Badge>
                <code className="ml-2 text-sm">/conversions?limit=20&offset=0&status=completed</code>
              </div>

              <h3 className="font-semibold mb-2">Query Parameters</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-medium-gray mb-4">
                <li><code>limit</code> - Number of results (default: 20, max: 100)</li>
                <li><code>offset</code> - Pagination offset (default: 0)</li>
                <li><code>status</code> - Filter by status (queued, processing, completed, failed)</li>
                <li><code>format</code> - Filter by format</li>
              </ul>
            </Card>

            {/* Webhooks */}
            <Card className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Webhooks</h2>
              <p className="text-neutral-medium-gray mb-4">
                Receive real-time notifications when conversions complete.
              </p>

              <h3 className="font-semibold mb-2">Events</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-medium-gray mb-4">
                <li><code>conversion.completed</code> - Fired when a conversion completes</li>
                <li><code>conversion.failed</code> - Fired when a conversion fails</li>
              </ul>

              <h3 className="font-semibold mb-2">Webhook Payload</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`{
  "event": "conversion.completed",
  "conversionId": "uuid",
  "downloadUrl": "https://...",
  "timestamp": "2025-01-01T00:00:00Z"
}`}</pre>
              </div>
            </Card>

            {/* Rate Limits */}
            <Card className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Free Tier</span>
                  <span className="text-neutral-medium-gray">No API access</span>
                </div>
                <div className="flex justify-between">
                  <span>Starter Tier</span>
                  <span className="text-neutral-medium-gray">No API access</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tier</span>
                  <span className="text-neutral-medium-gray">1000 requests/hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Enterprise Tier</span>
                  <span className="text-neutral-medium-gray">Unlimited</span>
                </div>
              </div>
            </Card>

            {/* Error Codes */}
            <Card className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Error Codes</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="text-red-600">400</code> - Bad Request
                </div>
                <div>
                  <code className="text-red-600">401</code> - Unauthorized
                </div>
                <div>
                  <code className="text-red-600">403</code> - Forbidden (plan limit reached)
                </div>
                <div>
                  <code className="text-red-600">404</code> - Not Found
                </div>
                <div>
                  <code className="text-red-600">429</code> - Too Many Requests
                </div>
                <div>
                  <code className="text-red-600">500</code> - Internal Server Error
                </div>
              </div>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-primary to-orange-600 text-white">
              <div className="text-center py-8">
                <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
                <p className="mb-6 text-orange-50">
                  Get your API key and start converting files programmatically
                </p>
                <a href="/dashboard/api">
                  <Button variant="secondary" size="lg">
                    Get API Key
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

