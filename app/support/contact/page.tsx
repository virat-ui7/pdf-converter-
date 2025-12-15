'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // TODO: Implement actual contact form submission API
    // For now, just simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-black text-center">
              Contact Us
            </h1>
            <p className="text-neutral-medium-gray mb-8 text-center">
              Have a question or need help? We're here to assist you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Contact Information */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-neutral-black">Get in Touch</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-neutral-black mb-2">Email Support</h3>
                    <a
                      href="mailto:support@fileconverter.com"
                      className="text-primary hover:underline"
                    >
                      support@fileconverter.com
                    </a>
                    <p className="text-sm text-neutral-medium-gray mt-1">
                      We typically respond within 24-48 hours
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-neutral-black mb-2">Business Inquiries</h3>
                    <a
                      href="mailto:business@fileconverter.com"
                      className="text-primary hover:underline"
                    >
                      business@fileconverter.com
                    </a>
                  </div>

                  <div>
                    <h3 className="font-medium text-neutral-black mb-2">Privacy & Legal</h3>
                    <a
                      href="mailto:privacy@fileconverter.com"
                      className="text-primary hover:underline"
                    >
                      privacy@fileconverter.com
                    </a>
                  </div>

                  <div>
                    <h3 className="font-medium text-neutral-black mb-2">Response Times</h3>
                    <ul className="text-sm text-neutral-dark-gray space-y-1">
                      <li>• Free tier: 48-72 hours</li>
                      <li>• Starter: 24-48 hours</li>
                      <li>• Professional: 2-4 hours</li>
                      <li>• Enterprise: 1 hour (priority support)</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Contact Form */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6 text-neutral-black">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Your Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />

                  <Input
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-dark-gray mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Report a Bug</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-dark-gray mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Please describe your question or issue..."
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-success/10 text-success rounded-lg">
                      Thank you! Your message has been sent. We'll get back to you soon.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-error/10 text-error rounded-lg">
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Additional Resources */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-black">Before You Contact Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-neutral-black mb-2">Check Our FAQ</h3>
                  <p className="text-sm text-neutral-dark-gray mb-3">
                    Many common questions are answered in our FAQ section.
                  </p>
                  <a
                    href="/support/faq"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View FAQ →
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-black mb-2">API Documentation</h3>
                  <p className="text-sm text-neutral-dark-gray mb-3">
                    For technical questions about our API, check our documentation.
                  </p>
                  <a
                    href="/api/docs"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View API Docs →
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

