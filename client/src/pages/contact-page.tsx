import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="bg-primary/5 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4" data-testid="text-page-title">
              Contact Us
            </h1>
            <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Get in touch with our team for any questions or support.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Have questions about our products, need help with an order, or just want to say hello? 
                  We're here to help! Reach out to us through any of the following channels.
                </p>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Email Us</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Our team typically responds within 24 hours
                          </p>
                          <a 
                            href="mailto:support@liftmeup.com" 
                            className="text-primary hover:underline"
                            data-testid="link-email"
                          >
                            support@liftmeup.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Call Us</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Mon-Fri, 9:00 AM - 6:00 PM
                          </p>
                          <a 
                            href="tel:+1234567890" 
                            className="text-primary hover:underline"
                            data-testid="link-phone"
                          >
                            +1 (234) 567-890
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Visit Us</h3>
                          <p className="text-sm text-muted-foreground">
                            123 Activewear Street<br />
                            Fashion District<br />
                            New York, NY 10001<br />
                            United States
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Business Hours</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p>Saturday: 10:00 AM - 4:00 PM</p>
                            <p>Sunday: Closed</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">How do I track my order?</h3>
                    <p className="text-sm text-muted-foreground">
                      Once your order ships, you'll receive a tracking number via email. You can also check your order status by logging into your account.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">What is your return policy?</h3>
                    <p className="text-sm text-muted-foreground">
                      We offer a 30-day return policy on all unworn items with original tags. Visit our Return & Shipping Policy page for full details.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Do you offer international shipping?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes! We ship to most countries worldwide. Shipping costs and delivery times vary by location.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">How do I find my size?</h3>
                    <p className="text-sm text-muted-foreground">
                      Each product page includes a detailed size guide. We recommend measuring yourself and comparing to our size chart for the best fit.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Can I change or cancel my order?</h3>
                    <p className="text-sm text-muted-foreground">
                      If you need to modify or cancel your order, please contact us immediately. Once an order is shipped, we cannot make changes.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Do you have physical stores?</h3>
                    <p className="text-sm text-muted-foreground">
                      Currently, we operate online only, but you're welcome to visit our showroom at the address listed above during business hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
