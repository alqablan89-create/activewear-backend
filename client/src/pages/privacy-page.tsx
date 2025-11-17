import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-semibold mb-8" data-testid="text-page-title">
            Privacy Policy
          </h1>
          
          <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, including your name, email address, shipping address, phone number, and payment information when you make a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations and updates</li>
                <li>Respond to your questions and provide customer support</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and conducting our business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookies</h2>
              <p>
                We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings, but this may affect your ability to use certain features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Children's Privacy</h2>
              <p>
                Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Changes to Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at privacy@liftmeup.ae
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
