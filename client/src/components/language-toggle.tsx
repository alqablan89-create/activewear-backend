import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useEffect } from 'react';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const updateDirection = () => {
      const isArabic = i18n.language === 'ar';
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      document.documentElement.lang = i18n.language;
      document.body.dir = isArabic ? 'rtl' : 'ltr';
    };
    
    updateDirection();
  }, [i18n.language]);

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    await i18n.changeLanguage(newLang);
    const isArabic = newLang === 'ar';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    document.body.dir = isArabic ? 'rtl' : 'ltr';
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
      data-testid="button-language-toggle"
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm font-medium">
        {i18n.language === 'en' ? 'AR' : 'EN'}
      </span>
    </Button>
  );
}
