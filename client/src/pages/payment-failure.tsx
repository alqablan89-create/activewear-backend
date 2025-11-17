import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 bg-background py-12 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <Card data-testid="failure-message">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl">{t('checkout.paymentFailed')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                {t('checkout.somethingWentWrong')}
              </p>

              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full"
                  data-testid="button-try-again"
                >
                  {t('checkout.tryAgain')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/cart')}
                  className="w-full"
                  data-testid="button-back-to-cart"
                >
                  {t('cart.title')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/shop')}
                  className="w-full"
                  data-testid="button-back-to-shop"
                >
                  {t('checkout.backToShop')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
