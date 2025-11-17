import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import type { Product, Category } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { HeroSlider } from '@/components/hero-slider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function HomePage() {
  const { t, i18n } = useTranslation();

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: newProducts, isLoading: newProductsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/new'],
  });

  const { data: featuredProducts, isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Categories Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12" data-testid="text-categories-title">
              {t('home.categories')}
            </h2>
            
            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categories?.slice(0, 4).map((category) => (
                  <Link key={category.id} href={`/shop?category=${category.slug}`}>
                    <div className="group cursor-pointer hover-elevate active-elevate-2 rounded-md overflow-hidden" data-testid={`card-category-${category.id}`}>
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={i18n.language === 'ar' ? category.nameAr : category.nameEn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-4xl">
                              {category.slug === 'performance-shirt' && '👕'}
                              {category.slug === 'hooded' && '🧥'}
                              {category.slug === 't-shirt' && '👚'}
                              {category.slug === 'caps' && '🧢'}
                              {category.slug === 'fragrance' && '🌸'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-medium text-lg" data-testid="text-category-name">
                          {i18n.language === 'ar' ? category.nameAr : category.nameEn}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold" data-testid="text-new-arrivals-title">
                {t('home.newArrivals')}
              </h2>
              <Link href="/shop?sort=newest">
                <Button variant="outline" data-testid="button-view-all">
                  View All
                </Button>
              </Link>
            </div>
            
            {newProductsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] rounded-md" />
                ))}
              </div>
            ) : newProducts && newProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {newProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No new products available
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
