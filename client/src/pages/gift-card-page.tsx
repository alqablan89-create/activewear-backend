import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Gift } from 'lucide-react';

const giftCardAmounts = [
  { value: '500', label: 'AED 500' },
  { value: '1000', label: 'AED 1,000' },
  { value: '2000', label: 'AED 2,000' },
  { value: '5000', label: 'AED 5,000' },
];

export default function GiftCardPage() {
  const [selectedAmount, setSelectedAmount] = useState('500');

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4" data-testid="text-page-title">
              Digital Gift Card
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Give the gift of choice with our digital gift cards. Perfect for any occasion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardContent className="p-8">
                  <div className="aspect-video bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">LIFT ME UP</h3>
                      <p className="text-sm opacity-90">A GIFT FOR YOU</p>
                      <p className="text-3xl font-bold mt-4">AED {selectedAmount}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <p>Eco-friendly digital delivery</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                      <p>Made in the UAE</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Select Amount
                  </Label>
                  <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
                    <div className="grid grid-cols-2 gap-3">
                      {giftCardAmounts.map((amount) => (
                        <div key={amount.value}>
                          <RadioGroupItem
                            value={amount.value}
                            id={amount.value}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={amount.value}
                            className={`flex items-center justify-center px-6 py-4 border-2 rounded-md cursor-pointer hover-elevate active-elevate-2 ${
                              selectedAmount === amount.value
                                ? 'border-primary bg-primary/5'
                                : 'border-input'
                            }`}
                            data-testid={`button-amount-${amount.value}`}
                          >
                            <span className="font-semibold">{amount.label}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <Button size="lg" className="w-full" data-testid="button-add-to-cart">
                  Add to Cart
                </Button>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold">How it works</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>1. Choose your gift card amount</li>
                      <li>2. Add to cart and complete checkout</li>
                      <li>3. Receive the digital gift card via email</li>
                      <li>4. Share with your loved ones or use it yourself</li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Note:</strong> Gift cards are delivered digitally and can be used for online
                    purchases. They never expire and can be combined with other payment methods.
                  </p>
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
