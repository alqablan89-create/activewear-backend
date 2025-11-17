import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from 'wouter';
import type { Product, Category } from '@shared/schema';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';

export default function ShopPage() {
  const { t, i18n } = useTranslation();
  const searchParams = new URLSearchParams(useSearch());
  const categoryParam = searchParams.get('category');

  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const filteredProducts = products?.filter((product) => {
    const matchesPrice = parseFloat(product.price) >= priceRange[0] && parseFloat(product.price) <= priceRange[1];
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.categoryId);
    const matchesColor = selectedColors.length === 0 || product.colors.some((c: string) => selectedColors.includes(c));
    const matchesSize = selectedSizes.length === 0 || product.sizes.some((s: string) => selectedSizes.includes(s));
    return matchesPrice && matchesCategory && matchesColor && matchesSize;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'priceLowHigh') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'priceHighLow') return parseFloat(b.price) - parseFloat(a.price);
    return 0;
  });

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-4 block">{t('shop.priceRange')}</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={200}
          step={10}
          className="mb-2"
          data-testid="slider-price"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-4 block">{t('shop.category')}</Label>
        <div className="space-y-2">
          {categories?.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => {
                  setSelectedCategories(
                    checked
                      ? [...selectedCategories, category.id]
                      : selectedCategories.filter((id) => id !== category.id)
                  );
                }}
                data-testid={`checkbox-category-${category.id}`}
              />
              <label htmlFor={category.id} className="ml-2 text-sm cursor-pointer">
                {i18n.language === 'ar' ? category.nameAr : category.nameEn}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-4 block">{t('shop.color')}</Label>
        <div className="space-y-2">
          {['Black', 'White', 'Gray', 'Blue', 'Pink', 'Green'].map((color) => (
            <div key={color} className="flex items-center">
              <Checkbox
                id={color}
                checked={selectedColors.includes(color)}
                onCheckedChange={(checked) => {
                  setSelectedColors(
                    checked
                      ? [...selectedColors, color]
                      : selectedColors.filter((c) => c !== color)
                  );
                }}
                data-testid={`checkbox-color-${color}`}
              />
              <label htmlFor={color} className="ml-2 text-sm cursor-pointer">
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-4 block">{t('shop.size')}</Label>
        <div className="space-y-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size} className="flex items-center">
              <Checkbox
                id={size}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => {
                  setSelectedSizes(
                    checked
                      ? [...selectedSizes, size]
                      : selectedSizes.filter((s) => s !== size)
                  );
                }}
                data-testid={`checkbox-size-${size}`}
              />
              <label htmlFor={size} className="ml-2 text-sm cursor-pointer">
                {size}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setPriceRange([0, 200]);
          setSelectedCategories([]);
          setSelectedColors([]);
          setSelectedSizes([]);
        }}
        data-testid="button-clear-filters"
      >
        {t('shop.clearFilters')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold" data-testid="text-shop-title">
              {t('nav.shop')}
            </h1>
            
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm" className="gap-2" data-testid="button-mobile-filters">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t('shop.filters')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="mt-8">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">{t('shop.sortBy')}:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]" data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('shop.newest')}</SelectItem>
                    <SelectItem value="priceLowHigh">{t('shop.priceLowHigh')}</SelectItem>
                    <SelectItem value="priceHighLow">{t('shop.priceHighLow')}</SelectItem>
                    <SelectItem value="bestSelling">{t('shop.bestSelling')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr] gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </aside>

            {/* Products Grid */}
            <div>
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {[...Array(9)].map((_, i) => (
                    <Skeleton key={i} className="aspect-[3/4] rounded-md" />
                  ))}
                </div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No products found matching your filters</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setPriceRange([0, 200]);
                      setSelectedCategories([]);
                      setSelectedColors([]);
                      setSelectedSizes([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
