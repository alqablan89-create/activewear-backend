import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useStripe, useElements, Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/lib/cart-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ShoppingBag, Lock, User } from 'lucide-react';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

function CheckoutForm() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (items.length === 0) {
      toast({
        title: t('cart.empty'),
        variant: 'destructive',
      });
      return;
    }

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      toast({
        title: t('checkout.requiredFields'),
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: t('checkout.paymentFailed'),
          description: error.message,
          variant: 'destructive',
        });
        navigate('/payment/failure');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        const orderData = {
          paymentIntentId: paymentIntent.id,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
        };

        const orderResponse = await apiRequest('POST', '/api/orders', orderData);
        const order = await orderResponse.json();
        
        await clearCart();
        
        navigate(`/payment/success?orderId=${order.id}`);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: t('checkout.paymentFailed'),
        description: error.message || t('checkout.somethingWentWrong'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="payment-form" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('checkout.shippingInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">{t('checkout.fullName')}</Label>
            <Input
              id="customer-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('checkout.fullName')}
              required
              data-testid="input-customer-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-email">{t('checkout.email')}</Label>
            <Input
              id="customer-email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder={t('checkout.email')}
              required
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-phone">{t('checkout.phone')}</Label>
            <Input
              id="customer-phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder={t('checkout.phone')}
              required
              data-testid="input-phone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping-address">{t('checkout.shippingAddress')}</Label>
            <Textarea
              id="shipping-address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder={t('checkout.shippingAddress')}
              rows={3}
              required
              data-testid="textarea-address"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {t('checkout.paymentDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PaymentElement />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!stripe || !elements || isProcessing}
            data-testid="button-pay-now"
          >
            {isProcessing ? t('checkout.processing') : t('checkout.payNow')}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

function CheckoutContent() {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();
  const { items, total, isLoading } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      navigate('/cart');
      return;
    }

    if (items.length > 0) {
      apiRequest("POST", "/api/create-payment-intent", { amount: total })
        .then((response) => response.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
        });
    }
  }, [items, total, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${numPrice.toFixed(2)} AED`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 bg-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8" data-testid="text-checkout-title">
            {t('checkout.title')}
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card data-testid="cart-summary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    {t('checkout.orderSummary')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4" data-testid={`cart-item-${item.id}`}>
                      <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 && (
                          <img 
                            src={item.product.images[0]} 
                            alt={i18n.language === 'ar' ? item.product.nameAr : item.product.nameEn}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium" data-testid={`text-product-name-${item.id}`}>
                          {i18n.language === 'ar' ? item.product.nameAr : item.product.nameEn}
                        </h3>
                        <div className="text-sm text-muted-foreground space-y-1 mt-1">
                          {item.selectedColor && (
                            <div data-testid={`text-color-${item.id}`}>
                              {t('checkout.color')}: {item.selectedColor}
                            </div>
                          )}
                          {item.selectedSize && (
                            <div data-testid={`text-size-${item.id}`}>
                              {t('checkout.size')}: {item.selectedSize}
                            </div>
                          )}
                          <div data-testid={`text-quantity-${item.id}`}>
                            {t('checkout.quantity')}: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold" data-testid={`text-price-${item.id}`}>
                          {formatPrice(parseFloat(item.product.price) * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('checkout.subtotal')}</span>
                      <span data-testid="text-subtotal">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('checkout.discount')}</span>
                      <span data-testid="text-discount">0.00 AED</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('checkout.total')}</span>
                      <span data-testid="text-total">{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.discountCode')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input 
                      placeholder={t('checkout.discountCode')}
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      data-testid="input-discount-code"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      data-testid="button-apply-discount"
                    >
                      {t('checkout.applyDiscount')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/shop')}
                data-testid="button-continue-shopping"
              >
                {t('checkout.continueShopping')}
              </Button>
            </div>

            <div>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm />
                </Elements>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center space-y-4">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" aria-label="Loading"/>
                      <p className="text-muted-foreground">{t('checkout.processing')}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function CheckoutPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>{t('checkout.stripeNotConfigured')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('checkout.stripeNotConfigured')}
              </p>
              <Button 
                onClick={() => navigate('/shop')}
                className="w-full"
                data-testid="button-back-to-shop"
              >
                {t('checkout.backToShop')}
              </Button>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return <CheckoutContent />;
}
