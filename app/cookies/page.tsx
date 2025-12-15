import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'

export const metadata = {
  title: 'Cookie Policy - FileConverter | Cookie Usage',
  description:
    'Learn about how FileConverter uses cookies and similar technologies to enhance your experience.',
  keywords: 'cookie policy, cookies, tracking, file converter',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-black">
              Cookie Policy
            </h1>
            <p className="text-neutral-medium-gray mb-8">
              Last Updated: December 15, 2025
            </p>

            <Card className="p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  1. What Are Cookies?
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  Cookies are small text files that are placed on your device (computer, tablet, or
                  mobile) when you visit a website. They are widely used to make websites work more
                  efficiently and provide information to website owners.
                </p>
                <p className="text-base text-neutral-dark-gray">
                  FileConverter uses cookies and similar technologies to enhance your experience,
                  analyze usage, and provide personalized content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  2. Types of Cookies We Use
                </h2>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">
                  2.1 Essential Cookies
                </h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  These cookies are necessary for the website to function properly. They enable core
                  functionality such as:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-6 ml-4">
                  <li>User authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Remembering your preferences</li>
                  <li>Maintaining your login state</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  These cookies cannot be disabled as they are essential for the service to work.
                </p>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">
                  2.2 Functional Cookies
                </h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  These cookies allow the website to remember choices you make and provide enhanced
                  features:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-6 ml-4">
                  <li>Language preferences</li>
                  <li>Theme preferences (light/dark mode)</li>
                  <li>Recently used formats</li>
                  <li>User interface preferences</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">
                  2.3 Analytics Cookies
                </h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  These cookies help us understand how visitors interact with our website by collecting
                  and reporting information anonymously:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-6 ml-4">
                  <li>Page views and navigation patterns</li>
                  <li>Conversion rates</li>
                  <li>Feature usage statistics</li>
                  <li>Error tracking</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  This information helps us improve our service and user experience.
                </p>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">
                  2.4 Advertising Cookies (Free Tier)
                </h3>
                <p className="text-base text-neutral-dark-gray mb-4">
                  For free tier users, we may use advertising cookies to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-6 ml-4">
                  <li>Display relevant advertisements</li>
                  <li>Limit the number of times you see an ad</li>
                  <li>Measure ad effectiveness</li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  Paid tier users do not see advertisements and these cookies are not used.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  3. Third-Party Cookies
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  We may use third-party services that set their own cookies:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Analytics Services:</strong> Google Analytics (if enabled) to analyze
                    website traffic
                  </li>
                  <li>
                    <strong>Payment Processors:</strong> PhonePe and card payment processors may set
                    cookies during payment flows
                  </li>
                  <li>
                    <strong>Authentication:</strong> OAuth providers (Google, GitHub) may set cookies
                    during login
                  </li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  These third-party cookies are subject to the respective privacy policies of those
                  services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  4. How Long Do Cookies Last?
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  Cookies can be either "session" or "persistent" cookies:
                </p>
                <ul className="list-disc list-inside space-y-2 text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Session Cookies:</strong> Temporary cookies that expire when you close
                    your browser. Used for authentication and session management.
                  </li>
                  <li>
                    <strong>Persistent Cookies:</strong> Remain on your device for a set period or
                    until you delete them. Used for preferences and analytics.
                  </li>
                </ul>
                <p className="text-base text-neutral-dark-gray">
                  Our authentication cookies typically last 15 minutes (session) with a 7-day refresh
                  token. Preference cookies may last up to 1 year.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  5. Managing Cookies
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  You have control over cookies. You can:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Browser Settings:</strong> Most browsers allow you to refuse or accept
                    cookies, delete existing cookies, or be notified before cookies are set
                  </li>
                  <li>
                    <strong>Opt-Out Tools:</strong> Use browser extensions or privacy tools to manage
                    cookies
                  </li>
                  <li>
                    <strong>Our Settings:</strong> Adjust cookie preferences in your account
                    settings (if available)
                  </li>
                </ul>
                <p className="text-base text-neutral-dark-gray mb-4">
                  <strong>Important:</strong> Disabling essential cookies may prevent you from using
                  certain features of our service, including logging in and converting files.
                </p>

                <h3 className="text-xl font-medium mb-3 text-neutral-black">
                  Browser-Specific Instructions:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-base text-neutral-dark-gray mb-4 ml-4">
                  <li>
                    <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site
                    data
                  </li>
                  <li>
                    <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                  </li>
                  <li>
                    <strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and
                    site permissions
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  6. Do Not Track Signals
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  Some browsers include a "Do Not Track" (DNT) feature that signals websites you
                  visit that you do not want to have your online activity tracked. Currently, there is
                  no standard for how DNT signals should be interpreted. We do not currently respond
                  to DNT browser signals, but we respect your privacy choices through cookie
                  management tools.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  7. Updates to This Policy
                </h2>
                <p className="text-base text-neutral-dark-gray">
                  We may update this Cookie Policy from time to time to reflect changes in our
                  practices or for legal, operational, or regulatory reasons. We will notify you of
                  any material changes by posting the new policy on this page and updating the "Last
                  Updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-neutral-black">
                  8. Contact Us
                </h2>
                <p className="text-base text-neutral-dark-gray mb-4">
                  If you have questions about our use of cookies, please contact us:
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

