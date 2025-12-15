import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'How It Works - FileConverter | Simple 3-Step Process',
  description:
    'Learn how FileConverter works in 3 simple steps. Upload, convert, and download your files in minutes.',
  keywords: 'how file converter works, file conversion process, convert files online',
}

export default function HowItWorksPage() {
  const steps = [
    {
      number: '1',
      title: 'Upload Your File',
      description:
        'Drag and drop your file into the converter, or click to browse and select a file. We support 110+ formats including PDF, DOCX, JPG, PNG, XLSX, and more.',
      icon: '📤',
      details: [
        'No account required for free tier',
        'Maximum file size: 100MB (free), up to 2GB (paid)',
        'Secure upload with encryption',
        'Automatic format detection',
      ],
    },
    {
      number: '2',
      title: 'Select Target Format',
      description:
        'Choose the format you want to convert to. Our smart converter will show you compatible formats based on your source file.',
      icon: '🎯',
      details: [
        'Search or browse 110+ formats',
        'See format compatibility',
        'Preview conversion options',
        'Advanced options available (quality, compression)',
      ],
    },
    {
      number: '3',
      title: 'Download Your File',
      description:
        'Once conversion is complete, download your converted file instantly. Files are automatically deleted after 24 hours for security.',
      icon: '⬇️',
      details: [
        'Instant download after conversion',
        'Preview before downloading',
        'Share via email or cloud storage',
        'Automatic file cleanup',
      ],
    },
  ]

  const tips = [
    {
      title: 'Best Quality Results',
      description:
        'For best results, use high-quality source files. Image conversions work best with original resolution files.',
    },
    {
      title: 'Large Files',
      description:
        'Large files may take longer to process. Paid users get priority processing for faster conversions.',
    },
    {
      title: 'Batch Conversion',
      description:
        'Professional and Enterprise users can convert multiple files at once, saving time and effort.',
    },
    {
      title: 'API Integration',
      description:
        'Integrate FileConverter into your applications using our REST API. Perfect for automation and workflows.',
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
                How FileConverter Works
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-50">
                Convert your files in 3 simple steps. Fast, secure, and free.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            <div className="max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-center gap-8 mb-16 last:mb-0`}
                >
                  <div className="flex-1">
                    <Card className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold">
                          {step.number}
                        </div>
                        <div className="text-5xl">{step.icon}</div>
                      </div>
                      <h2 className="text-3xl font-bold mb-4 text-neutral-black">
                        {step.title}
                      </h2>
                      <p className="text-lg text-neutral-dark-gray mb-6">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="flex items-start gap-2 text-base text-neutral-dark-gray"
                          >
                            <span className="text-primary mt-1">✓</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                  <div className="flex-1">
                    <div className="bg-neutral-light-gray rounded-lg p-8 text-center">
                      <div className="text-6xl mb-4">{step.icon}</div>
                      <p className="text-neutral-medium-gray">
                        Step {step.number} of 3
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16 md:py-24 bg-neutral-light-gray">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-black">
                Pro Tips for Best Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tips.map((tip, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-neutral-black">
                      {tip.title}
                    </h3>
                    <p className="text-base text-neutral-dark-gray">
                      {tip.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Video/Demo Section Placeholder */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-black">
                See It In Action
              </h2>
              <p className="text-lg text-neutral-dark-gray mb-8">
                Watch how easy it is to convert files with FileConverter
              </p>
              <div className="bg-neutral-light-gray rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">▶️</div>
                  <p className="text-neutral-medium-gray">
                    Video demo coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Convert Your Files?
              </h2>
              <p className="text-xl mb-8 text-orange-50">
                No signup required. Start converting files for free right now.
              </p>
              <Link href="/convert">
                <Button variant="secondary" size="lg">
                  Start Converting Now
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

