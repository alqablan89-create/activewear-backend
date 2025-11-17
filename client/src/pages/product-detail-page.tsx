import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import type { Product } from '@shared/schema';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Play, Eye, Ruler, Shirt, Truck, RotateCcw } from 'lucide-react';

export default function ProductDetailPage() {
  const { t, i18n } = useTranslation();
  const [, params] = useRoute('/product/:id');
  const { addItem } = useCart();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', params?.id],
    enabled: !!params?.id,
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ['/api/products/category', product?.categoryId],
    enabled: !!product?.categoryId,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }
    
    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    addItem(product, quantity, selectedColor, selectedSize);
    toast({
      title: "Added to cart",
      description: `${i18n.language === 'ar' ? product.nameAr : product.nameEn} added to your cart`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-square rounded-md" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const name = i18n.language === 'ar' ? product.nameAr : product.nameEn;
  const description = i18n.language === 'ar' ? product.descriptionAr : product.descriptionEn;
  const hasDiscount = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);
  const images = product.images || [];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-md overflow-hidden bg-muted relative">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={name}
                    className="w-full h-full object-cover"
                    data-testid="img-product-main"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No Image
                  </div>
                )}
                {product.videoUrl && selectedImage === images.length && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <video src={product.videoUrl} controls className="max-h-full max-w-full" />
                  </div>
                )}
              </div>
              
              {(images.length > 1 || product.videoUrl) && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                      data-testid={`button-thumbnail-${index}`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {product.videoUrl && (
                    <button
                      onClick={() => setSelectedImage(images.length)}
                      className={`aspect-square rounded-md overflow-hidden border-2 bg-muted flex items-center justify-center ${
                        selectedImage === images.length ? 'border-primary' : 'border-transparent'
                      }`}
                      data-testid="button-video-thumbnail"
                    >
                      <Play className="h-6 w-6" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold mb-3" data-testid="text-product-name">
                  {name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold" data-testid="text-product-price">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        ${parseFloat(product.compareAtPrice!).toFixed(2)}
                      </span>
                      <Badge variant="destructive">Sale</Badge>
                    </>
                  )}
                </div>
                {product.isNew && <Badge>New Arrival</Badge>}
              </div>

              {description && (
                <p className="text-muted-foreground" data-testid="text-product-description">
                  {description}
                </p>
              )}

              <div className="space-y-4">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      {t('product.selectColor')}
                    </Label>
                    <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color: string) => (
                          <div key={color} className="flex items-center">
                            <RadioGroupItem value={color} id={color} className="sr-only" />
                            <Label
                              htmlFor={color}
                              className={`px-4 py-2 border-2 rounded-md cursor-pointer hover-elevate active-elevate-2 ${
                                selectedColor === color ? 'border-primary bg-primary/5' : 'border-input'
                              }`}
                              data-testid={`button-color-${color}`}
                            >
                              {color}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      {t('product.selectSize')}
                    </Label>
                    <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size: string) => (
                          <div key={size} className="flex items-center">
                            <RadioGroupItem value={size} id={size} className="sr-only" />
                            <Label
                              htmlFor={size}
                              className={`px-4 py-2 border-2 rounded-md cursor-pointer hover-elevate active-elevate-2 ${
                                selectedSize === size ? 'border-primary bg-primary/5' : 'border-input'
                              }`}
                              data-testid={`button-size-${size}`}
                            >
                              {size}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div>
                  <Label className="text-base font-medium mb-3 block">Quantity</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      data-testid="button-decrease-quantity"
                    >
                      -
                    </Button>
                    <span className="text-lg font-medium w-12 text-center" data-testid="text-quantity">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      data-testid="button-increase-quantity"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={product.stockQuantity > 0 ? "default" : "destructive"}>
                  {product.stockQuantity > 0 ? t('product.inStock') : t('product.outOfStock')}
                </Badge>
                {product.stockQuantity > 0 && product.stockQuantity < 10 && (
                  <span className="text-sm text-muted-foreground">
                    Only {product.stockQuantity} left
                  </span>
                )}
              </div>

              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {t('product.addToCart')}
              </Button>

              {/* Product Information Accordion */}
              <Accordion type="single" collapsible className="w-full mt-8">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-left font-medium" data-testid="button-accordion-product-details">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Product Details
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid="content-product-details">
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Premium quality activewear designed for performance</li>
                      <li>Moisture-wicking fabric keeps you dry and comfortable</li>
                      <li>Four-way stretch for maximum mobility</li>
                      <li>Flatlock seams to prevent chafing</li>
                      <li>UV protection for outdoor activities</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fit">
                  <AccordionTrigger className="text-left font-medium" data-testid="button-accordion-fit">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Fit
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid="content-fit">
                    <p className="mb-3">True to size with a comfortable, athletic fit.</p>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Designed to fit close to the body for support</li>
                      <li>If between sizes, we recommend sizing up</li>
                      <li>Model is 5'8" wearing size S</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fabric-care">
                  <AccordionTrigger className="text-left font-medium" data-testid="button-accordion-fabric-care">
                    <div className="flex items-center gap-2">
                      <Shirt className="h-4 w-4" />
                      Fabric Care
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid="content-fabric-care">
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Machine wash cold with like colors</li>
                      <li>Do not bleach</li>
                      <li>Tumble dry low or hang dry</li>
                      <li>Do not iron</li>
                      <li>Do not dry clean</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-left font-medium" data-testid="button-accordion-shipping">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping & Delivery
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid="content-shipping">
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Free shipping on orders over $100</li>
                      <li>Standard shipping: 5-7 business days</li>
                      <li>Express shipping: 2-3 business days (additional fee)</li>
                      <li>Orders are processed within 24 hours</li>
                      <li>Tracking information provided via email</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="returns">
                  <AccordionTrigger className="text-left font-medium" data-testid="button-accordion-returns">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Free Returns
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid="content-returns">
                    <ul className="space-y-2 list-disc list-inside">
                      <li>30-day return policy</li>
                      <li>Items must be unworn and in original condition</li>
                      <li>Free return shipping within the UAE</li>
                      <li>Refunds processed within 5-7 business days</li>
                      <li>Contact customer service to initiate a return</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 1 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-8" data-testid="text-related-title">
                {t('product.youMayLike')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts
                  .filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .map((relatedProduct) => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
