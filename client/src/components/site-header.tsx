import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageToggle } from './language-toggle';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function SiteHeader() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.shop'), href: '/shop' },
    { name: t('nav.categories'), href: '/categories' },
    { name: t('nav.offers'), href: '/offers' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-base font-medium hover-elevate active-elevate-2 block px-4 py-2 rounded-md">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/">
            <span className="text-xl font-bold tracking-tight" data-testid="link-home">
              Lift Me Up
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-2 rounded-md" data-testid={`link-${item.href.slice(1) || 'home'}`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
              className="relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  data-testid="badge-cart-count"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(user.isAdmin ? '/admin' : '/account')}
                data-testid="button-account"
              >
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                data-testid="button-login"
              >
                {t('nav.login')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
