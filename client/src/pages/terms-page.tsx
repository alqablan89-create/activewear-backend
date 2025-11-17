import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-semibold mb-8" data-testid="text-page-title">
            Terms and Conditions
          </h1>
          
          <div className="prose prose-neutral max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Lift Me Up's website and services, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials on Lift Me Up's website for personal, non-commercial transitory viewing only.
              </p>
              <p>This license shall automatically terminate if you violate any of these restrictions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Product Information</h2>
              <p>
                We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Pricing and Payment</h2>
              <p>
                All prices are listed in AED (United Arab Emirates Dirham) and are subject to change without notice. Payment must be received in full before order processing begins.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Shipping and Delivery</h2>
              <p>
                We ship within the UAE. Delivery times are estimates and are not guaranteed. Lift Me Up is not responsible for delays caused by shipping carriers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Returns and Refunds</h2>
              <p>
                Items may be returned within 30 days of purchase in unworn, original condition with tags attached. Refunds will be processed within 5-7 business days of receiving the returned item.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
              <p>
                Lift Me Up shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the United Arab Emirates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us at support@liftmeup.ae
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
