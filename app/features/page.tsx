import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Features - FileConverter | 117 Format Support & More',
  description:
    'Discover all the powerful features of FileConverter: 117 format support, batch processing, API access, webhooks, and more.',
  keywords: 'file converter features, batch conversion, API access, webhooks, file conversion features',
}

export default function FeaturesPage() {
  const features = [
    {
      category: 'Core Features',
      items: [
        {
          title: '117 Format Support',
          description:
            'Convert between 117 file formats across documents (43 formats), images (50 formats), spreadsheets (17 formats), and presentations (7 formats). From PDF to Word, JPG to PNG, and everything in between.',
          icon: '📄',
        },
        {
          title: 'Drag & Drop Upload',
          description:
            'Simply drag and drop your files into the converter. No complicated uploads or confusing interfaces. It just works.',
          icon: '📤',
        },
        {
          title: 'Batch Processing',
          description:
            'Convert multiple files at once. Professional and Enterprise users can process unlimited files simultaneously.',
          icon: '📦',
        },
        {
          title: 'Instant Preview',
          description:
            'Preview your converted files before downloading. Ensure quality and format before saving to your device.',
          icon: '👁️',
        },
      ],
    },
    {
      category: 'Security & Privacy',
      items: [
        {
          title: 'Secure Processing',
          description:
            'All files are encrypted in transit and stored securely. Files are automatically deleted after processing.',
          icon: '🔒',
        },
        {
          title: 'No Account Required',
          description:
            'Start converting immediately without creating an account. Free tier users can convert up to 200 files per month.',
          icon: '🚀',
        },
        {
          title: 'Privacy First',
          description:
            'We never access, read, or share your file contents. Your files are processed and deleted automatically.',
          icon: '🛡️',
        },
        {
          title: 'GDPR Compliant',
          description:
            'Fully compliant with GDPR and international data protection regulations. Your data, your rights.',
          icon: '✅',
        },
      ],
    },
    {
      category: 'Advanced Features',
      items: [
        {
          title: 'REST API Access',
          description:
            'Professional and Enterprise users get full API access for programmatic file conversions. Integrate FileConverter into your applications.',
          icon: '🔌',
        },
        {
          title: 'Webhooks',
          description:
            'Receive real-time notifications when conversions complete. Perfect for automated workflows and integrations.',
          icon: '🔔',
        },
        {
          title: 'Cloud Storage Integration',
          description:
            'Connect with Google Drive, Dropbox, and OneDrive. Import and export files directly from your cloud storage.',
          icon: '☁️',
        },
        {
          title: 'Advanced Options',
          description:
            'Customize image quality, PDF compression, page ranges, and color modes. Full control over your conversions.',
          icon: '⚙️',
        },
      ],
    },
    {
      category: 'Business Features',
      items: [
        {
          title: 'White-Label Option',
          description:
            'Professional and Enterprise users can customize the interface with their branding. Perfect for agencies and enterprises.',
          icon: '🎨',
        },
        {
          title: 'Priority Processing',
          description:
            'Paid users get faster processing times. Enterprise users get instant conversions with 99.99% uptime SLA.',
          icon: '⚡',
        },
        {
          title: 'Team Management',
          description:
            'Enterprise tier includes team management features. Invite team members, manage roles, and track usage.',
          icon: '👥',
        },
        {
          title: 'Conversion History',
          description:
            'Track all your conversions with detailed history. Search, filter, and download previous conversions.',
          icon: '📊',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-orange-500 to-orange-600 text-white py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Powerful Features for Every Need
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-50">
                Everything you need to convert files quickly, securely, and efficiently
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/convert">
                  <Button variant="secondary" size="lg">
                    Start Converting
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            {features.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16 last:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-black">
                  {category.category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.items.map((feature, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="text-3xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold mb-3 text-neutral-black">
                        {feature.title}
                      </h3>
                      <p className="text-base text-neutral-dark-gray">
                        {feature.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-16 md:py-24 bg-neutral-light-gray">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-black">
                Feature Comparison by Plan
              </h2>
              <Card className="p-8 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-neutral-medium-gray">
                      <th className="text-left py-4 px-4 font-semibold text-neutral-black">Feature</th>
                      <th className="text-center py-4 px-4 font-semibold text-neutral-black">Free</th>
                      <th className="text-center py-4 px-4 font-semibold text-neutral-black">Starter</th>
                      <th className="text-center py-4 px-4 font-semibold text-neutral-black">Professional</th>
                      <th className="text-center py-4 px-4 font-semibold text-neutral-black">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-medium-gray">
                      <td className="py-4 px-4">Conversions/month</td>
                      <td className="text-center py-4 px-4">200</td>
                      <td className="text-center py-4 px-4">1,000</td>
                      <td className="text-center py-4 px-4">10,000</td>
                      <td className="text-center py-4 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b border-neutral-medium-gray">
                      <td className="py-4 px-4">File size limit</td>
                      <td className="text-center py-4 px-4">100MB</td>
                      <td className="text-center py-4 px-4">500MB</td>
                      <td className="text-center py-4 px-4">2GB</td>
                      <td className="text-center py-4 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b border-neutral-medium-gray">
                      <td className="py-4 px-4">Batch processing</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="border-b border-neutral-medium-gray">
                      <td className="py-4 px-4">API access</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="border-b border-neutral-medium-gray">
                      <td className="py-4 px-4">Webhooks</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="border-b border-neutral-medium-gray">
                      <td className="py-4 px-4">White-label</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">❌</td>
                      <td className="text-center py-4 px-4">✅</td>
                      <td className="text-center py-4 px-4">✅</td>
                    </tr>
                    <tr className="border-b border-neutral-medium-gray">
                      <td className="py-4 px-4">Priority support</td>
                      <td className="text-center py-4 px-4">Email</td>
                      <td className="text-center py-4 px-4">Email (48h)</td>
                      <td className="text-center py-4 px-4">Chat (2h)</td>
                      <td className="text-center py-4 px-4">Phone (1h)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">Uptime SLA</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">-</td>
                      <td className="text-center py-4 px-4">99.99%</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 text-orange-50">
                Start converting files for free, or upgrade for more features and higher limits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/convert">
                  <Button variant="secondary" size="lg">
                    Try Free Converter
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

