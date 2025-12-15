import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'FileConverter - Convert 110+ File Formats Instantly | Free Online Converter',
  description:
    'Convert documents, images, spreadsheets, and presentations to 110+ formats. Fast, secure, and free. No registration required.',
  keywords: 'file converter, pdf converter, image converter, document converter',
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-orange-500 to-orange-600 text-white py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Convert 110+ File Formats Instantly
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-50">
              Fast, Secure, Free Online File Converter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/convert">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Start Converting Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white/10">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">110+ Formats</h3>
              <p className="text-neutral-medium-gray">
                Support for documents, images, spreadsheets, and presentations
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-neutral-medium-gray">
                Your files are encrypted and automatically deleted after 24 hours
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-neutral-medium-gray">
                Convert files in seconds with our optimized processing engine
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Formats Grid */}
      <section className="py-16 md:py-24 bg-neutral-light-gray">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Supported Formats
            </h2>
            <p className="text-lg text-neutral-medium-gray">
              Convert between 110+ file formats across 4 categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Documents', count: 25, icon: '📄' },
              { name: 'Images', count: 30, icon: '🖼️' },
              { name: 'Spreadsheets', count: 20, icon: '📊' },
              { name: 'Presentations', count: 15, icon: '📽️' },
            ].map((format) => (
              <Card
                key={format.name}
                className="text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-4xl mb-4">{format.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{format.name}</h3>
                <p className="text-primary font-medium">{format.count}+ formats</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/formats">
              <Button variant="ghost" size="md">
                View All Formats →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">How It Works</h2>
            <p className="text-lg text-neutral-medium-gray">
              Convert your files in just 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Upload',
                description: 'Drag and drop your file or click to browse',
                icon: '📤',
              },
              {
                step: '2',
                title: 'Select Format',
                description: 'Choose your desired output format from 110+ options',
                icon: '🎯',
              },
              {
                step: '3',
                title: 'Download',
                description: 'Get your converted file instantly, ready to use',
                icon: '⬇️',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-neutral-medium-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 md:py-24 bg-neutral-light-gray">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Simple Pricing</h2>
            <p className="text-lg text-neutral-medium-gray">
              Choose the plan that works for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                conversions: '200/mo',
                features: ['Basic conversions', '100MB file size', 'Ad-supported'],
              },
              {
                name: 'Starter',
                price: '$4.99',
                conversions: '1,000/mo',
                features: ['Standard conversions', '500MB file size', 'No ads'],
              },
              {
                name: 'Professional',
                price: '$14.99',
                conversions: '10,000/mo',
                features: ['Priority processing', '2GB file size', 'API access'],
              },
              {
                name: 'Enterprise',
                price: '$49.99',
                conversions: 'Unlimited',
                features: ['White-label', '99.99% SLA', 'Dedicated support'],
              },
            ].map((plan) => (
              <Card
                key={plan.name}
                className={`${plan.name === 'Professional' ? 'border-2 border-primary shadow-lg' : ''}`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-neutral-medium-gray">/month</span>
                  </div>
                  <p className="text-sm text-neutral-medium-gray">{plan.conversions}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
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
                      <span className="text-sm text-neutral-dark-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <Button
                    variant={plan.name === 'Professional' ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-neutral-medium-gray">
              See what our users are saying
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Designer',
                rating: 5,
                text: 'The fastest file converter I\'ve used. Perfect for my workflow!',
              },
              {
                name: 'Michael Chen',
                role: 'Developer',
                rating: 5,
                text: 'API integration is seamless. Great documentation and support.',
              },
              {
                name: 'Emily Davis',
                role: 'Student',
                rating: 5,
                text: 'Free tier is perfect for my needs. No registration required!',
              },
            ].map((testimonial, idx) => (
              <Card key={idx}>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-dark-gray mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-neutral-dark-gray">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-neutral-medium-gray">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-neutral-light-gray">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Is my data secure?',
                answer:
                  'Yes! All files are encrypted during transfer and automatically deleted after 24 hours. We never store your files permanently.',
              },
              {
                question: 'What file formats are supported?',
                answer:
                  'We support 110+ formats across documents (PDF, DOCX, etc.), images (JPG, PNG, etc.), spreadsheets (XLSX, CSV, etc.), and presentations (PPTX, etc.).',
              },
              {
                question: 'Is there a file size limit?',
                answer:
                  'Free tier: 100MB, Starter: 500MB, Professional: 2GB, Enterprise: Unlimited.',
              },
              {
                question: 'How long does conversion take?',
                answer:
                  'Most conversions complete in under 30 seconds. Larger files may take up to 2 minutes.',
              },
              {
                question: 'Do I need to create an account?',
                answer:
                  'No! You can use our free tier without registration. Sign up for additional features and higher limits.',
              },
            ].map((faq, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-neutral-medium-gray">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-orange-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Converting?
          </h2>
          <p className="text-xl mb-8 text-orange-50">
            Join thousands of users converting files every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/convert">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Start Converting Now
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-white border-white hover:bg-white/10"
              >
                Try Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
