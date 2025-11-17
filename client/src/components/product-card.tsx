import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import type { Product } from '@shared/schema';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const { toast } = useToast();

  const name = i18n.language === 'ar' ? product.nameAr : product.nameEn;
  const hasDiscount = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${name} added to your cart`,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group cursor-pointer hover-elevate active-elevate-2 overflow-hidden h-full flex flex-col" data-testid={`card-product-${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No Image
            </div>
          )}
          
          {product.isNew && (
            <Badge className="absolute top-2 right-2" data-testid="badge-new">
              New
            </Badge>
          )}
          
          {hasDiscount && (
            <Badge variant="destructive" className="absolute top-2 left-2" data-testid="badge-sale">
              Sale
            </Badge>
          )}
        </div>

        <CardContent className="flex-1 p-4">
          <h3 className="font-medium text-base line-clamp-2 mb-2" data-testid="text-product-name">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg" data-testid="text-product-price">
              AED {parseFloat(product.price).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                AED {parseFloat(product.compareAtPrice!).toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            size="sm"
            className="w-full gap-2"
            onClick={handleQuickAdd}
            data-testid="button-quick-add"
          >
            <ShoppingCart className="h-4 w-4" />
            {t('product.addToCart')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
