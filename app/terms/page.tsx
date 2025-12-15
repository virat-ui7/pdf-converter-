import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Terms of Service - FileConverter | User Agreement',
  description:
    'Read our terms of service to understand the rules and guidelines for using FileConverter file conversion service.',
  keywords: 'terms of service, user agreement, file converter terms',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-black">
              Terms of Service
            </h1>
            <p className="text-neutral-medium-gray mb-8">
              Last Updated: December 15, 2025
            </p>

            <Card className="p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  1. Acceptance of Terms
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  By accessing or using FileConverter ("the Service"), you agree to be bound by these
                  Terms of Service ("Terms"). If you disagree with any part of these terms, you may
                  not access the Service.
                </p>
                <p className="text-base text-neutral-dark-gray">
                  We reserve the right to update, change, or replace any part of these Terms at any
                  time. It is your responsibility to check this page periodically for changes. Your
                  continued use of the Service after any changes constitutes acceptance of those
                  changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  2. Description of Service
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  FileConverter is an online file conversion service that allows users to convert files
                  between various formats including documents, images, spreadsheets, and presentations.
                  We offer both free and paid subscription tiers with different features and limits.
                </p>
                <p className="text-base text-neutral-dark-gray">
                  We reserve the right to modify, suspend, or discontinue any part of the Service at
                  any time, with or without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  3. User Accounts
                </h2>
                <h3 className="text-xl font-medium mb-3 text-neutral-black">3.1 Account Creation</h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">3.2 Account Responsibility</h3>
                <p className="text-base text-neutral-dark-gray">
                  You are responsible for maintaining the confidentiality of your account credentials
                  and for all activities that occur under your account. We are not liable for any loss
                  or damage arising from your failure to protect your account information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  4. Acceptable Use
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Upload, convert, or distribute illegal, harmful, or offensive content</li>
                  <li>Violate any laws, regulations, or third-party rights</li>
                  <li>Upload files containing viruses, malware, or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated systems (bots, scrapers) without permission</li>
                  <li>Resell or redistribute the Service without authorization</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                  <li>Upload copyrighted material without permission</li>
                  <li>Spam, harass, or abuse other users</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  Violation of these terms may result in immediate termination of your account and
                  legal action.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  5. File Uploads and Content
                </h2>
                <h3 className="text-xl font-medium mb-3 text-neutral-black">5.1 Your Content</h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  You retain ownership of all files you upload. By uploading files, you grant us a
                  limited license to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Process and convert your files</li>
                  <li>Store files temporarily for conversion</li>
                  <li>Delete files after processing (as per our retention policy)</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">5.2 Prohibited Content</h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  You may not upload files containing:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Illegal content or content that violates laws</li>
                  <li>Copyrighted material without authorization</li>
                  <li>Malicious software or code</li>
                  <li>Personal information of others without consent</li>
                  <li>Content that violates our Acceptable Use Policy</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">5.3 File Deletion</h3>
                <p className="text-base text-neutral-dark-gray">
                  Files are automatically deleted after processing (24 hours for free tier, or as per
                  your subscription plan). We are not responsible for any loss of data due to
                  automatic deletion or system failures.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  6. Subscriptions and Payments
                </h2>
                <h3 className="text-xl font-medium mb-3 text-neutral-black">6.1 Subscription Plans</h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We offer various subscription plans with different features and limits. Subscription
                  fees are billed in advance on a monthly or annual basis.
                </p>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">6.2 Payment Terms</h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  By subscribing, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Pay all fees associated with your subscription</li>
                  <li>Provide accurate billing information</li>
                  <li>Authorize automatic recurring payments</li>
                  <li>Accept that fees are non-refundable except as required by law</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">6.3 Cancellation</h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  You may cancel your subscription at any time. Cancellation takes effect at the end of
                  your current billing period. You will continue to have access to paid features until
                  the end of your billing period.
                </p>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">6.4 Refunds</h3>
                <p className="text-base text-neutral-dark-gray">
                  Refunds are provided only in accordance with our refund policy or as required by
                  applicable law. We do not offer refunds for partial billing periods.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  7. Intellectual Property
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  The Service, including its original content, features, and functionality, is owned by
                  FileConverter and is protected by international copyright, trademark, patent, trade
                  secret, and other intellectual property laws.
                </p>
                <p className="text-base text-neutral-dark-gray">
                  You may not copy, modify, distribute, sell, or lease any part of our Service or
                  included software, nor may you reverse engineer or attempt to extract the source code
                  of that software.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  8. Service Availability
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We strive to provide reliable service but do not guarantee:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Uninterrupted or error-free service</li>
                  <li>100% uptime (except for Enterprise tier with SLA)</li>
                  <li>Specific conversion results or quality</li>
                  <li>Compatibility with all file formats or versions</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  We reserve the right to perform maintenance, updates, or modifications that may
                  temporarily interrupt service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  9. Limitation of Liability
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, FILECONVERTER SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits, revenue, data, or use</li>
                  <li>Service interruptions or failures</li>
                  <li>Loss or corruption of uploaded files</li>
                  <li>Inaccurate conversion results</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  Our total liability shall not exceed the amount you paid us in the 12 months prior
                  to the claim.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  10. Indemnification
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  You agree to indemnify and hold harmless FileConverter, its officers, directors,
                  employees, and agents from any claims, damages, losses, liabilities, and expenses
                  (including legal fees) arising out of your use of the Service, violation of these
                  Terms, or infringement of any rights of another.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  11. Termination
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We may terminate or suspend your account immediately, without prior notice, for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Non-payment of fees</li>
                  <li>Extended period of inactivity</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  Upon termination, your right to use the Service will immediately cease. We may
                  delete your account and data, subject to our data retention policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  12. Governing Law
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  These Terms shall be governed by and construed in accordance with the laws of [Your
                  Jurisdiction], without regard to its conflict of law provisions. Any disputes arising
                  from these Terms shall be resolved in the courts of [Your Jurisdiction].
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  13. Changes to Terms
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  We reserve the right to modify these Terms at any time. We will notify users of
                  material changes via email or through the Service. Your continued use after changes
                  constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  14. Contact Information
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-neutral-light-gray p-4 rounded-lg">
                  <p className="text-base text-neutral-dark-gray">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:legal@fileconverter.com" className="text-primary hover:underline">
                      legal@fileconverter.com
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

