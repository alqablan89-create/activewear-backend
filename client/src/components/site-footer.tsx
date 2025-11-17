import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaTiktok, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { CreditCard, Lock } from 'lucide-react';

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Lift Me Up</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Premium women's activewear designed for comfort, style, and performance.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-instagram"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-tiktok"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-youtube"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-whatsapp"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
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
              <li>
                <Link href="/gift-card">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-gift-card">
                    Gift Cards
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-terms">
                    Terms & Conditions
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-privacy">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-cookie">
                    Cookie Policy
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
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-category-performance">Performance Shirts</span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hooded">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-category-hooded">Hooded Tops</span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=t-shirt">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-category-tshirt">T-Shirts</span>
                </Link>
              </li>
              <li>
                <Link href="/shop?category=caps">
                  <span className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-category-caps">Caps</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted/50 border" data-testid="badge-secure-payment">
                <Lock className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted/50 border" data-testid="badge-trusted">
                <CreditCard className="w-4 h-4" />
                <span>Trusted Checkout</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{t('footer.copyright')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
