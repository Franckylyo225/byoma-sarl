import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

// Import fallback images
import heroForestRoad from "@/assets/hero-forest-road.jpg";
import heroLandPlot from "@/assets/hero-land-plot.jpg";
import heroDrone from "@/assets/hero-drone.jpg";
import heroInnovation from "@/assets/hero-innovation.jpg";

interface HeroSlide {
  id: string;
  badge: string | null;
  headline: string;
  highlight: string | null;
  description: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
}

// Fallback static slides in case DB is empty
const fallbackSlides: HeroSlide[] = [
  {
    id: "1",
    badge: "Notre vision",
    headline: "Aménager aujourd'hui,",
    highlight: "préserver demain",
    description: "Votre partenaire de confiance pour un aménagement durable des terres et forêts. Nous transformons vos espaces en opportunités durables.",
    image_url: heroForestRoad,
    button_text: "Découvrir nos services",
    button_link: "#services",
  },
  {
    id: "2",
    badge: "Notre expertise",
    headline: "Leader en",
    highlight: "aménagement foncier",
    description: "10 ans d'expérience dans la valorisation et la transformation des espaces fonciers en Côte d'Ivoire. Lotissement, urbanisme et conseil expert.",
    image_url: heroLandPlot,
    button_text: "Découvrir nos services",
    button_link: "#services",
  },
  {
    id: "3",
    badge: "Notre savoir-faire",
    headline: "Expertise forestière",
    highlight: "reconnue",
    description: "Gestion durable des forêts, reboisement et préservation de la biodiversité. Partenaire de confiance du Ministère des Eaux et Forêts.",
    image_url: heroDrone,
    button_text: "Découvrir nos services",
    button_link: "#services",
  },
  {
    id: "4",
    badge: "Notre engagement",
    headline: "Innovation &",
    highlight: "développement durable",
    description: "Nous allions technologies modernes et respect de l'environnement pour des solutions pérennes qui profitent aux générations futures.",
    image_url: heroInnovation,
    button_text: "Découvrir nos services",
    button_link: "#services",
  },
];

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Fetch slides from database
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('id, badge, headline, highlight, description, image_url, button_text, button_link')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setSlides(data);
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
      }
    };

    fetchSlides();
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, slides.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, slides.length]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Get image URL (handle both local imports and remote URLs)
  const getImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) return heroForestRoad;
    // If it starts with http or blob, it's a remote URL
    if (imageUrl.startsWith('http') || imageUrl.startsWith('blob')) {
      return imageUrl;
    }
    // Otherwise it's a local import (fallback)
    return imageUrl;
  };

  return (
    <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Images with crossfade and parallax */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={getImageUrl(slide.image_url)}
            alt={`${slide.headline} ${slide.highlight || ''}`}
            className="w-full h-[120%] object-cover"
            style={{
              transform: `translateY(${scrollY * 0.3}px) scale(${index === currentSlide ? 1.05 : 1})`,
              transition: "transform 0.1s linear",
            }}
          />
        </div>
      ))}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Slide indicator lines */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group flex items-center gap-3"
            aria-label={`Slide ${index + 1}`}
          >
            <div
              className={`h-0.5 transition-all duration-500 ${
                index === currentSlide
                  ? "w-12 bg-primary"
                  : "w-6 bg-white/30 group-hover:bg-white/50"
              }`}
            />
            <span
              className={`text-xs font-medium transition-all duration-300 ${
                index === currentSlide
                  ? "text-primary opacity-100"
                  : "text-white/50 opacity-0 group-hover:opacity-100"
              }`}
            >
              0{index + 1}
            </span>
          </button>
        ))}
      </div>

      <div className="container-custom relative z-10 py-20 lg:py-0">
        {/* Content Slider */}
        <div className="max-w-3xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-700 ${
                index === currentSlide
                  ? "opacity-100 translate-y-0 relative"
                  : "opacity-0 translate-y-8 absolute inset-0 pointer-events-none"
              }`}
            >
              {/* Badge */}
              {slide.badge && (
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-medium tracking-wider uppercase text-white">{slide.badge}</span>
                </div>
              )}

              {/* Headline */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 text-white">
                {slide.headline}{" "}
                {slide.highlight && (
                  <span className="text-primary block mt-2">{slide.highlight}</span>
                )}
              </h1>

              {/* Description */}
              {slide.description && (
                <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                  {slide.description}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                {slide.button_link?.startsWith('#') ? (
                  <Button variant="hero" size="xl" asChild>
                    <a href={slide.button_link}>
                      {slide.button_text || 'Découvrir nos services'}
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </Button>
                ) : (
                  <Button variant="hero" size="xl" asChild>
                    <Link to={slide.button_link || '#services'}>
                      {slide.button_text || 'Découvrir nos services'}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                )}
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to="/projets">
                    <Play className="w-5 h-5" />
                    Voir nos réalisations
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300"
          aria-label="Slide précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 ${
                index === currentSlide
                  ? "w-8 h-2 bg-primary rounded-full"
                  : "w-2 h-2 bg-white/30 rounded-full hover:bg-white/50"
              }`}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300"
          aria-label="Slide suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
