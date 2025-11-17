import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  const searchParams = new URLSearchParams(window.location.search);
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 bg-background py-12 flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <Card data-testid="success-message">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">{t('checkout.paymentSuccess')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                {t('checkout.thankYou')}
              </p>
              
              {orderId && (
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t('checkout.orderNumber')}
                  </p>
                  <p className="font-mono font-semibold" data-testid="text-order-id">
                    {orderId}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/shop')}
                  className="w-full"
                  data-testid="button-back-to-shop"
                >
                  {t('checkout.backToShop')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                  data-testid="button-back-home"
                >
                  {t('nav.home')}
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
