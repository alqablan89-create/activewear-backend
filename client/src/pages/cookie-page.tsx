import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function CookiePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-semibold mb-8" data-testid="text-page-title">
            Cookie Policy
          </h1>
          
          <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">Performance Cookies</h3>
              <p>
                These cookies collect information about how visitors use our website, such as which pages are visited most often. This helps us improve our website's performance.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">Functionality Cookies</h3>
              <p>
                These cookies allow our website to remember choices you make (such as language preferences) and provide enhanced features.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">Marketing Cookies</h3>
              <p>
                These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Cookies</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Keeping you signed in to your account</li>
                <li>Remembering your shopping cart items</li>
                <li>Understanding how you use our website</li>
                <li>Showing you relevant products and offers</li>
                <li>Improving website performance and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Managing Cookies</h2>
              <p>
                You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience and parts of our website may no longer be fully accessible.
              </p>
              <p className="mt-2">
                Most browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. Check your browser's help section for instructions on managing cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Third-Party Cookies</h2>
              <p>
                We may use third-party services (such as analytics providers) that may set cookies on your device. These cookies are controlled by the third party and are subject to their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Updates to Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us at privacy@liftmeup.ae
              </p>
            </section>

            <p className="text-sm mt-8">Last updated: November 2025</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
