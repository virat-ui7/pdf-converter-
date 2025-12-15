import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'GDPR Compliance - FileConverter | Data Protection Rights',
  description:
    'Learn about FileConverter\'s GDPR compliance and your data protection rights under the General Data Protection Regulation.',
  keywords: 'GDPR, data protection, privacy rights, EU compliance',
}

export default function GDPRPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-black">
              GDPR Compliance
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
                  The General Data Protection Regulation (GDPR) is a European Union (EU) regulation
                  that governs data protection and privacy for individuals within the EU. FileConverter
                  is committed to GDPR compliance and protecting the privacy rights of all users,
                  including those in the EU.
                </p>
                <p className="text-base text-neutral-dark-gray">
                  This page outlines how we comply with GDPR requirements and your rights as a data
                  subject.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  2. Your Rights Under GDPR
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  As a data subject under GDPR, you have the following rights:
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-neutral-black">
                      2.1 Right of Access (Article 15)
                    </h3>
                    <p className="text-base text-neutral-dark-gray">
                      You have the right to obtain confirmation as to whether or not personal data
                      concerning you is being processed, and access to that data. You can request a
                      copy of all personal data we hold about you.
                    </p>
                    <p className="text-base text-neutral-dark-gray mt-2">
                      <strong>How to exercise:</strong> Contact us at{' '}
                      <a href="mailto:privacy@fileconverter.com" className="text-primary hover:underline">
                        privacy@fileconverter.com
                      </a>{' '}
                      with the subject "GDPR Data Access Request"
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2 text-neutral-black">
                      2.2 Right to Rectification (Article 16)
                    </h3>
                    <p className="text-base text-neutral-dark-gray">
                      You have the right to have inaccurate personal data corrected and incomplete
                      data completed. You can update your account information directly in your
                      dashboard settings.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2 text-neutral-black">
                      2.3 Right to Erasure / "Right to be Forgotten" (Article 17)
                    </h3>
                    <p className="text-base text-neutral-dark-gray">
                      You have the right to request deletion of your personal data when:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mt-2 ml-4">
                      <li>The data is no longer necessary for the original purpose</li>
                      <li>You withdraw consent and there is no other legal basis</li>
                      <li>You object to processing and there are no overriding legitimate grounds</li>
                      <li>The data has been unlawfully processed</li>
                    </ul>
                    <p className="text-base text-neutral-dark-gray mt-2">
                      <strong>How to exercise:</strong> Delete your account in dashboard settings or
                      contact us at{' '}
                      <a href="mailto:privacy@fileconverter.com" className="text-primary hover:underline">
                        privacy@fileconverter.com
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2 text-neutral-black">
                      2.4 Right to Restrict Processing (Article 18)
                    </h3>
                    <p className="text-base text-neutral-dark-gray">
                      You have the right to restrict the processing of your personal data in certain
                      circumstances, such as when you contest the accuracy of the data or object to
                      processing.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2 text-neutral-black">
                      2.5 Right to Data Portability (Article 20)
                    </h3>
                    <p className="text-base text-neutral-dark-gray">
                      You have the right to receive your personal data in a structured, commonly used,
                      and machine-readable format and to transmit that data to another controller.
                    </p>
                    <p className="text-base text-neutral-dark-gray mt-2">
                      <strong>How to exercise:</strong> Contact us to request your data export
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2 text-neutral-black">
                      2.6 Right to Object (Article 21)
                    </h3>
                    <p className="text-base text-neutral-dark-gray">
                      You have the right to object to processing of your personal data for direct
                      marketing purposes or when processing is based on legitimate interests.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2 text-neutral-black">
                      2.7 Rights Related to Automated Decision-Making (Article 22)
                    </h3>
                    <p className="text-base text-neutral-dark-gray">
                      You have the right not to be subject to a decision based solely on automated
                      processing, including profiling, which produces legal effects concerning you.
                      FileConverter does not use automated decision-making that produces legal effects.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  3. Legal Basis for Processing
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  Under GDPR, we process your personal data based on the following legal bases:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Consent:</strong> When you create an account and agree to our terms
                  </li>
                  <li>
                    <strong>Contract Performance:</strong> To provide file conversion services you
                    request
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> To comply with legal requirements (e.g., tax
                    records)
                  </li>
                  <li>
                    <strong>Legitimate Interests:</strong> To improve our service, prevent fraud, and
                    ensure security
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  4. Data Processing Activities
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We process the following categories of personal data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Identity Data:</strong> Name, email address, account ID
                  </li>
                  <li>
                    <strong>Contact Data:</strong> Email address, billing address (if provided)
                  </li>
                  <li>
                    <strong>Technical Data:</strong> IP address, browser type, device information
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Conversion history, API usage, feature usage
                  </li>
                  <li>
                    <strong>Financial Data:</strong> Payment information (processed by payment
                    processors, not stored by us)
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  5. Data Transfers
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  Your data may be transferred to and processed in countries outside the EU/EEA. We
                  ensure appropriate safeguards are in place:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Standard Contractual Clauses:</strong> We use EU-approved standard
                    contractual clauses with our service providers
                  </li>
                  <li>
                    <strong>Adequacy Decisions:</strong> We transfer data to countries with adequate
                    data protection laws
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Our providers (Supabase, Mailgun, payment
                    processors) are GDPR-compliant
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  6. Data Retention
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We retain your personal data only for as long as necessary:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Account Data:</strong> Retained until you delete your account or request
                    deletion
                  </li>
                  <li>
                    <strong>Conversion Data:</strong> Files deleted after 24 hours (free tier) or as
                    per your plan; metadata retained for history
                  </li>
                  <li>
                    <strong>Financial Records:</strong> Retained for 7 years as required by law
                  </li>
                  <li>
                    <strong>Analytics Data:</strong> Anonymized and retained for up to 2 years
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  7. Data Security
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We implement appropriate technical and organizational measures to protect your data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Encryption in transit (HTTPS/TLS)</li>
                  <li>Encryption at rest for sensitive data</li>
                  <li>Access controls and authentication</li>
                  <li>Regular security audits</li>
                  <li>Secure password hashing (bcrypt)</li>
                  <li>Automatic file deletion</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  8. Data Breach Notification
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  In the event of a data breach that poses a risk to your rights and freedoms, we
                  will:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mt-2 mb-4 ml-4">
                  <li>Notify the relevant supervisory authority within 72 hours</li>
                  <li>Notify affected users without undue delay</li>
                  <li>Provide details of the breach and mitigation steps</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  9. Exercising Your Rights
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  To exercise any of your GDPR rights:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>Contact us at{' '}
                    <a href="mailto:privacy@fileconverter.com" className="text-primary hover:underline">
                      privacy@fileconverter.com
                    </a>
                  </li>
                  <li>Include "GDPR Request" in the subject line</li>
                  <li>Specify which right you wish to exercise</li>
                  <li>Provide proof of identity (to protect your data)</li>
                </ol>
                <p className="text-base text-neutral-dark-gray">
                  We will respond to your request within 30 days (or inform you if we need more time).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  10. Supervisory Authority
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  If you are not satisfied with how we handle your personal data, you have the right
                  to lodge a complaint with your local data protection supervisory authority. For EU
                  residents, you can find your authority at{' '}
                  <a
                    href="https://edpb.europa.eu/about-edpb/board/members_en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    EDPB Members
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  11. Contact Information
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  For GDPR-related inquiries, contact our Data Protection Officer:
                </p>
                <div className="bg-neutral-light-gray p-4 rounded-lg">
                  <p className="text-base text-neutral-dark-gray">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@fileconverter.com" className="text-primary hover:underline">
                      privacy@fileconverter.com
                    </a>
                  </p>
                  <p className="text-base text-neutral-dark-gray mt-2">
                    <strong>Subject Line:</strong> "GDPR Inquiry"
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

