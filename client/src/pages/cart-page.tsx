import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/lib/cart-context';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const { items, removeItem, updateQuantity, total } = useCart();

  // Check for bundle discount (T-shirt + Cap)
  const hasTShirt = items.some(item => {
    const categorySlug = item.product.categoryId?.toLowerCase();
    return categorySlug?.includes('t-shirt');
  });
  const hasCap = items.some(item => {
    const categorySlug = item.product.categoryId?.toLowerCase();
    return categorySlug?.includes('cap');
  });
  const bundleDiscount = hasTShirt && hasCap ? total * 0.1 : 0;
  const finalTotal = total - bundleDiscount;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-semibold mb-8" data-testid="text-cart-title">
            {t('cart.title')}
          </h1>

          {items.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-medium mb-2">{t('cart.empty')}</h2>
                <p className="text-muted-foreground mb-6">Start adding some products to your cart</p>
                <Link href="/shop">
                  <Button data-testid="button-continue-shopping">{t('cart.continueShopping')}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              <div className="space-y-4">
                {items.map((item, index) => {
                  const name = i18n.language === 'ar' ? item.product.nameAr : item.product.nameEn;
                  return (
                    <Card key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0]}
                                alt={name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium mb-1 truncate" data-testid={`text-cart-item-name-${index}`}>
                              {name}
                            </h3>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                                {item.selectedColor && item.selectedSize && ' | '}
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                              </p>
                            )}
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                data-testid={`button-decrease-${index}`}
                              >
                                -
                              </Button>
                              <span className="text-sm font-medium w-8 text-center" data-testid={`text-quantity-${index}`}>
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                data-testid={`button-increase-${index}`}
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          <div className="text-right flex flex-col justify-between">
                            <p className="font-semibold" data-testid={`text-price-${index}`}>
                              ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.product.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              data-testid={`button-remove-${index}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('cart.subtotal')}</span>
                        <span data-testid="text-subtotal">${total.toFixed(2)}</span>
                      </div>
                      
                      {bundleDiscount > 0 && (
                        <div className="flex justify-between text-sm text-primary">
                          <span>{t('cart.discount')} (Bundle 10%)</span>
                          <span data-testid="text-discount">-${bundleDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                        <span>{t('cart.total')}</span>
                        <span data-testid="text-total">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button size="lg" className="w-full" data-testid="button-checkout">
                      {t('cart.checkout')}
                    </Button>
                    
                    <Link href="/shop">
                      <Button variant="outline" className="w-full" data-testid="button-continue">
                        {t('cart.continueShopping')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
