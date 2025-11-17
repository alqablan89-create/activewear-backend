import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Lift Me Up</h3>
            <p className="text-sm text-muted-foreground">
              Premium women's activewear designed for comfort, style, and performance.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-about">
                    {t('footer.about')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-shipping">
                    {t('footer.shipping')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-contact">
                    {t('footer.contact')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=performance-shirt">
                  <span className="text-sm text-muted-foreground hover:text-foreground">Performance Shirts</span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hooded">
                  <span className="text-sm text-muted-foreground hover:text-foreground">Hooded Tops</span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=t-shirt">
                  <span className="text-sm text-muted-foreground hover:text-foreground">T-Shirts</span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=caps">
                  <span className="text-sm text-muted-foreground hover:text-foreground">Caps</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
