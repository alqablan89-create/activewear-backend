import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage from '@assets/generated_images/Womens_activewear_hero_lifestyle_8c862ad9.png';

interface Slide {
  image: string;
  title: string;
  subtitle?: string;
  cta: string;
  link: string;
}

export function HeroSlider() {
  const { t, i18n } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const slides: Slide[] = [
    {
      image: heroImage,
      title: t('hero.headline'),
      cta: t('hero.cta'),
      link: '/shop',
    },
    {
      image: heroImage,
      title: 'New Collection',
      subtitle: 'Elevate Your Performance',
      cta: 'Explore Now',
      link: '/shop?sort=newest',
    },
    {
      image: heroImage,
      title: 'Premium Activewear',
      subtitle: 'Made in UAE',
      cta: 'Discover More',
      link: '/shop?featured=true',
    },
  ];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative h-[80vh] md:h-[600px] overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide, index) => (
            <div key={index} className="embla__slide flex-[0_0_100%] relative">
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              </div>

              <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
                <div className="text-center max-w-3xl">
                  <h1 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" 
                    data-testid={`text-hero-headline-${index}`}
                  >
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="text-xl md:text-2xl text-white/90 mb-6">
                      {slide.subtitle}
                    </p>
                  )}
                  <Link href={slide.link}>
                    <Button 
                      size="lg" 
                      className="text-lg px-8 backdrop-blur-md bg-primary/90" 
                      data-testid={`button-hero-cta-${index}`}
                    >
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover-elevate active-elevate-2 z-10"
        aria-label="Previous slide"
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover-elevate active-elevate-2 z-10"
        aria-label="Next slide"
        data-testid="button-next-slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex
                ? 'bg-white w-8'
                : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-dot-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
