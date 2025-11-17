import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Heart, Target, Award, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="bg-primary/5 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4" data-testid="text-page-title">
              About Lift Me Up
            </h1>
            <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering women through premium activewear that combines style, comfort, and performance
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <section className="mb-16">
              <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Lift Me Up was born from a simple belief: every woman deserves activewear that makes her feel confident, comfortable, and ready to conquer her goals. We understand that when you look good and feel good, you perform at your best.
                </p>
                <p>
                  Founded with a passion for quality and design, we've made it our mission to create premium women's activewear that seamlessly transitions from your workout to your everyday life. Our collections are thoughtfully designed to support your active lifestyle while celebrating your unique style.
                </p>
                <p>
                  From performance shirts that wick away moisture during intense training sessions to stylish hooded tops perfect for your morning run, every piece in our collection is crafted with attention to detail and your comfort in mind.
                </p>
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl font-semibold mb-8">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Passion for Quality</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We source only the finest fabrics and materials, ensuring every piece meets our high standards for durability, comfort, and performance.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Customer Focus</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Your satisfaction is our priority. We listen to your feedback and continuously improve our products to better serve your needs.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Excellence in Design</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Our design team stays ahead of trends while maintaining timeless appeal, creating pieces you'll love wearing season after season.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Community First</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We're building more than a brand – we're creating a community of strong, confident women who support and inspire each other.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold mb-6">Why Choose Lift Me Up?</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Premium Materials:</strong> We use advanced moisture-wicking fabrics, breathable mesh panels, and stretch materials that move with you.
                </p>
                <p>
                  <strong className="text-foreground">Perfect Fit:</strong> Our sizes are designed to flatter all body types, with sizes ranging from XS to XL.
                </p>
                <p>
                  <strong className="text-foreground">Versatile Style:</strong> Whether you're hitting the gym, running errands, or meeting friends, our activewear adapts to your lifestyle.
                </p>
                <p>
                  <strong className="text-foreground">Trusted Quality:</strong> Every product goes through rigorous quality checks before reaching you, ensuring you receive only the best.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
