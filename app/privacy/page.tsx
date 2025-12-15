import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Privacy Policy - FileConverter | Your Data Protection',
  description:
    'Read our privacy policy to understand how FileConverter collects, uses, and protects your personal information and file data.',
  keywords: 'privacy policy, data protection, GDPR, file converter privacy',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-black">
              Privacy Policy
            </h1>
            <p className="text-neutral-medium-gray mb-8">
              Last Updated: December 15, 2025
            </p>

            <Card className="p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  1. Introduction
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  Welcome to FileConverter ("we," "our," or "us"). We are committed to protecting
                  your privacy and ensuring the security of your personal information. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard your information when
                  you use our file conversion service.
                </p>
                <p className="text-base text-neutral-dark-gray">
                  By using FileConverter, you agree to the collection and use of information in
                  accordance with this policy. If you do not agree with our policies and practices,
                  please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  2. Information We Collect
                </h2>
                <h3 className="text-xl font-medium mb-3 text-neutral-black">2.1 Personal Information</h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  When you create an account or use our service, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Name and email address</li>
                  <li>Password (encrypted and hashed)</li>
                  <li>Billing information (processed securely through payment processors)</li>
                  <li>Profile information (avatar, preferences)</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">2.2 File Data</h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  When you upload files for conversion:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Files are temporarily stored for processing</li>
                  <li>Files are automatically deleted after 24 hours (free tier) or as per your plan</li>
                  <li>We do not access, read, or share your file contents</li>
                  <li>File metadata (name, size, format) is stored for conversion history</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">2.3 Usage Data</h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We automatically collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Conversion history and statistics</li>
                  <li>API usage data (for Professional+ tiers)</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  3. How We Use Your Information
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We use the collected information for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Providing and maintaining our file conversion service</li>
                  <li>Processing your file conversions</li>
                  <li>Managing your account and subscriptions</li>
                  <li>Sending you service-related emails (conversion notifications, account updates)</li>
                  <li>Improving our service and user experience</li>
                  <li>Detecting and preventing fraud or abuse</li>
                  <li>Complying with legal obligations</li>
                  <li>Analyzing usage patterns and trends</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  4. Data Storage and Security
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We use industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>All data is encrypted in transit (HTTPS/TLS)</li>
                  <li>Passwords are hashed using bcrypt</li>
                  <li>Files are stored securely in Supabase Storage (S3-compatible)</li>
                  <li>Automatic file deletion after processing</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  However, no method of transmission over the Internet or electronic storage is 100%
                  secure. While we strive to use commercially acceptable means to protect your data,
                  we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  5. Data Sharing and Disclosure
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We do not sell your personal information. We may share your information only in the
                  following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Service Providers:</strong> With trusted third-party services (Supabase,
                    Mailgun, payment processors) that help us operate our service
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                    sale of assets
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> When you explicitly authorize us to share
                    information
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  6. Your Rights and Choices
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct your personal information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account and data
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your data in a machine-readable format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing emails (service emails will
                    continue)
                  </li>
                  <li>
                    <strong>Object:</strong> Object to processing of your data for certain purposes
                  </li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  To exercise these rights, contact us at{' '}
                  <a href="mailto:privacy@fileconverter.com" className="text-primary hover:underline">
                    privacy@fileconverter.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  7. Cookies and Tracking
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Maintain your session and authentication</li>
                  <li>Remember your preferences</li>
                  <li>Analyze service usage</li>
                  <li>Provide personalized content</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  You can control cookies through your browser settings. However, disabling cookies may
                  affect your ability to use certain features of our service.
                </p>
                <p className="text-base text-neutral-dark-gray mt-4">
                  For more information, see our{' '}
                  <a href="/cookies" className="text-primary hover:underline">
                    Cookie Policy
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  8. Data Retention
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We retain your data for as long as necessary to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  Files are automatically deleted after 24 hours (free tier) or as per your
                  subscription plan. Account data is retained until you request deletion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  9. Children's Privacy
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  Our service is not intended for children under 13 years of age. We do not knowingly
                  collect personal information from children under 13. If you believe we have collected
                  information from a child under 13, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  10. International Data Transfers
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  Your information may be transferred to and processed in countries other than your
                  country of residence. These countries may have different data protection laws. By
                  using our service, you consent to the transfer of your information to these countries.
                  We ensure appropriate safeguards are in place to protect your data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  11. Changes to This Privacy Policy
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the "Last
                  Updated" date. You are advised to review this Privacy Policy periodically for any
                  changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  12. Contact Us
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please
                  contact us:
                </p>
                <div className="bg-neutral-light-gray p-4 rounded-lg">
                  <p className="text-base text-neutral-dark-gray">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@fileconverter.com" className="text-primary hover:underline">
                      privacy@fileconverter.com
                    </a>
                  </p>
                  <p className="text-base text-neutral-dark-gray mt-2">
                    <strong>Support:</strong>{' '}
                    <a href="/support/contact" className="text-primary hover:underline">
                      Contact Support
                    </a>
                  </p>
                </div>
              </section>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

