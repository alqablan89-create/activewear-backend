import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import heroVideo from '@assets/hero-video.mp4';

export function HeroSlider() {
  const { t } = useTranslation();

  return (
    <section className="relative h-[80vh] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          data-testid="video-hero"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" 
            data-testid="text-hero-headline"
          >
            {t('hero.headline')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6">
            {t('hero.subheadline')}
          </p>
          <Link href="/shop">
            <Button 
              size="lg" 
              className="text-lg px-8 backdrop-blur-md bg-primary/90" 
              data-testid="button-hero-cta"
            >
              {t('hero.cta')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
