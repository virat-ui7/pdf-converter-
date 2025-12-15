'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: 'General',
    question: 'What file formats does FileConverter support?',
    answer:
      'FileConverter supports 110+ file formats across 4 categories: Documents (43 formats including PDF, DOCX, ODT, RTF), Spreadsheets (14 formats including XLSX, CSV, ODS), Presentations (7 formats including PPTX, ODP), and Images (47 formats including JPG, PNG, WebP, SVG, HEIC).',
  },
  {
    category: 'General',
    question: 'Do I need to create an account to use FileConverter?',
    answer:
      'No, you can use FileConverter without creating an account. However, creating a free account gives you access to conversion history, higher limits, and additional features. Paid accounts offer even more benefits like unlimited conversions and API access.',
  },
  {
    category: 'General',
    question: 'Is FileConverter free to use?',
    answer:
      'Yes! FileConverter offers a free tier with 200 conversions per month. We also offer paid plans (Starter, Professional, Enterprise) with more features, higher limits, and priority processing. See our Pricing page for details.',
  },
  {
    category: 'General',
    question: 'How fast are file conversions?',
    answer:
      'Conversion speed depends on file size and format. Free tier users typically experience 2-5 minute processing times. Paid tier users get faster processing (1-2 minutes for Starter, 30 seconds for Professional, instant for Enterprise).',
  },
  {
    category: 'General',
    question: 'What is the maximum file size I can convert?',
    answer:
      'File size limits vary by tier: Free tier (100MB), Starter (500MB), Professional (2GB), Enterprise (Unlimited). If you need to convert larger files, consider upgrading your plan.',
  },
  {
    category: 'Security & Privacy',
    question: 'Is my data secure?',
    answer:
      'Yes, we take security seriously. All files are encrypted in transit (HTTPS) and stored securely. Files are automatically deleted after processing (24 hours for free tier). We never access, read, or share your file contents. See our Privacy Policy for more details.',
  },
  {
    category: 'Security & Privacy',
    question: 'What happens to my files after conversion?',
    answer:
      'Files are automatically deleted after processing. Free tier files are deleted after 24 hours. Paid tier files are deleted according to your plan settings. We never store your files permanently or share them with third parties.',
  },
  {
    category: 'Security & Privacy',
    question: 'Do you store my payment information?',
    answer:
      'No, we do not store your payment information. All payments are processed securely through our payment partners (PhonePe for India, card processors for international). We only store billing addresses and subscription status.',
  },
  {
    category: 'Account & Billing',
    question: 'How do I upgrade my plan?',
    answer:
      'You can upgrade your plan at any time from the Pricing page or your Dashboard. Simply select your desired plan, complete the payment, and your account will be upgraded immediately. You\'ll be charged a prorated amount for the remainder of your billing cycle.',
  },
  {
    category: 'Account & Billing',
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time from your Dashboard → Billing page. Your subscription will remain active until the end of your current billing period. You\'ll continue to have access to paid features until then.',
  },
  {
    category: 'Account & Billing',
    question: 'Do you offer refunds?',
    answer:
      'We offer refunds in accordance with our refund policy and applicable law. Generally, we do not offer refunds for partial billing periods. If you believe you are entitled to a refund, please contact our support team.',
  },
  {
    category: 'Account & Billing',
    question: 'What payment methods do you accept?',
    answer:
      'We accept PhonePe for Indian users (INR) and international credit/debit cards (Visa, Mastercard, Amex) for global users. All payments are processed securely through our payment partners.',
  },
  {
    category: 'Technical',
    question: 'Why did my conversion fail?',
    answer:
      'Conversions can fail for several reasons: unsupported format, corrupted file, file size too large, or server issues. Check the error message for details. If the problem persists, try converting the file again or contact support.',
  },
  {
    category: 'Technical',
    question: 'Can I convert multiple files at once?',
    answer:
      'Batch processing is available for Professional and Enterprise tier users. Free and Starter tier users can convert files one at a time. Upgrade your plan to access batch processing features.',
  },
  {
    category: 'Technical',
    question: 'Do you have an API?',
    answer:
      'Yes! Professional and Enterprise tier users have access to our REST API for programmatic file conversions. You can create API keys from your Dashboard → API page. See our API documentation for details.',
  },
  {
    category: 'Technical',
    question: 'What browsers are supported?',
    answer:
      'FileConverter works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for the best experience.',
  },
  {
    category: 'Technical',
    question: 'Can I integrate FileConverter with my application?',
    answer:
      'Yes! Professional and Enterprise tier users can integrate FileConverter using our REST API and webhooks. See our API documentation for integration guides and code examples.',
  },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const categories = ['All', ...Array.from(new Set(faqData.map((item) => item.category)))]

  const filteredFAQs =
    selectedCategory === 'All'
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-black text-center">
              Frequently Asked Questions
            </h1>
            <p className="text-neutral-medium-gray mb-8 text-center">
              Find answers to common questions about FileConverter
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setOpenIndex(null)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-neutral-light-gray text-neutral-dark-gray hover:bg-neutral-medium-gray'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-neutral-light-gray transition-colors"
                  >
                    <div className="flex-1">
                      <div className="text-xs text-primary font-medium mb-1">{faq.category}</div>
                      <h3 className="text-lg font-semibold text-neutral-black">{faq.question}</h3>
                    </div>
                    <svg
                      className={`w-5 h-5 text-neutral-medium-gray transition-transform ${
                        openIndex === index ? 'transform rotate-180' : ''
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
                  {openIndex === index && (
                    <div className="px-6 pb-6 text-base text-neutral-dark-gray">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Contact Support CTA */}
            <Card className="mt-8 p-8 text-center bg-primary-light">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                Still have questions?
              </h2>
              <p className="text-base text-neutral-dark-gray mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a
                href="/support/contact"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
              >
                Contact Support
              </a>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

