import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

import heroMain from "@/assets/hero-byoma-main.jpg";
import heroNegoce from "@/assets/service-negoce.jpg";
import heroDistribution from "@/assets/service-distribution.jpg";
import heroImmobilier from "@/assets/service-immobilier.jpg";
import agentByoma from "@/assets/agent-byoma.jpg";

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

const fallbackSlides: HeroSlide[] = [
  {
    id: "1",
    badge: "Filiale de BYOMA GROUP",
    headline: "Bâtir l'avenir,",
    highlight: "ensemble.",
    description: "Un partenaire multisectoriel engagé pour des solutions fiables et durables en Côte d'Ivoire.",
    image_url: heroMain,
    button_text: "Découvrir nos services",
    button_link: "#services",
  },
  {
    id: "2",
    badge: "Négoce international",
    headline: "Le commerce,",
    highlight: "sans frontières.",
    description: "Import-export stratégique dans des secteurs à forte valeur ajoutée, avec un réseau de partenaires fiables.",
    image_url: heroNegoce,
    button_text: "En savoir plus",
    button_link: "/services/negoce",
  },
  {
    id: "3",
    badge: "Énergie",
    headline: "L'énergie qui",
    highlight: "fait avancer.",
    description: "Distribution fiable de produits pétroliers et gaziers pour accompagner la croissance économique.",
    image_url: heroDistribution,
    button_text: "En savoir plus",
    button_link: "/services/distribution-petroliere",
  },
  {
    id: "4",
    badge: "Immobilier",
    headline: "L'immobilier",
    highlight: "d'exception.",
    description: "Promotion et gestion de biens immobiliers alliant confort, élégance et durabilité.",
    image_url: heroImmobilier,
    button_text: "En savoir plus",
    button_link: "/services/immobilier",
  },
];

const stats = [
  { value: "3+", label: "Secteurs d'activité" },
  { value: "2023", label: "Année de création" },
  { value: "100%", label: "Engagement client" },
];

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('id, badge, headline, highlight, description, image_url, button_text, button_link')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) setSlides(data);
      } catch (err) {
        console.error('Error fetching hero slides:', err);
      }
    };
    fetchSlides();
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

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const getImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) return heroMain;
    return imageUrl;
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Sliding backgrounds */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={getImageUrl(slide.image_url)}
            alt={slide.headline}
            className="w-full h-full object-cover scale-105"
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,50%,10%)]/90 via-[hsl(220,50%,10%)]/70 to-[hsl(220,50%,10%)]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,50%,10%)] via-transparent to-[hsl(220,50%,10%)]/30" />

      {/* Fixed agent image — centered vertically */}
      <div className="hidden lg:block absolute right-[max(2rem,calc((100%-1280px)/2))] top-1/2 -translate-y-1/2 z-10">
        <div className="relative w-[360px] xl:w-[420px]">
          <div className="rounded-3xl border border-white/15 backdrop-blur-md bg-white/5 p-3">
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <img
                src={agentByoma}
                alt="Agent BYOMA SARL"
                className="w-full h-[420px] xl:h-[480px] object-cover object-top"
              />
            </div>
          </div>
          {/* Decorative glass badge */}
          <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3">
            <span className="text-accent font-display font-bold text-lg">BYOMA</span>
            <span className="text-white/60 text-sm ml-1">SARL</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom w-full relative z-10 min-h-screen flex flex-col justify-end pb-12 lg:pb-16">
        <div className="lg:max-w-[55%]">
          {/* Left: sliding text */}
          <div className="relative">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0 relative"
                    : "opacity-0 translate-y-8 absolute inset-0 pointer-events-none"
                }`}
              >
                {slide.badge && (
                  <div className="inline-flex items-center gap-2 mb-6">
                    <span className="w-8 h-px bg-accent" />
                    <span className="text-sm font-medium tracking-[0.2em] uppercase text-accent">
                      {slide.badge}
                    </span>
                  </div>
                )}

                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 text-white">
                  {slide.headline}
                  {slide.highlight && (
                    <span className="text-accent italic block">{slide.highlight}</span>
                  )}
                </h1>

                {slide.description && (
                  <p className="text-base lg:text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
                    {slide.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4">
                  {slide.button_link?.startsWith('#') ? (
                    <Button variant="hero" size="xl" asChild>
                      <a href={slide.button_link}>
                        {slide.button_text || 'Découvrir'}
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="hero" size="xl" asChild>
                      <Link to={slide.button_link || '#services'}>
                        {slide.button_text || 'Découvrir'}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="hero-outline" size="xl" asChild>
                    <Link to="/a-propos">
                      En savoir plus
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center gap-4 mt-10">
          <button
            onClick={prevSlide}
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 text-sm text-white/50 font-medium">
            <span className="text-white text-lg font-display">0{currentSlide + 1}</span>
            <span className="mx-2">/</span>
            <span>0{slides.length}</span>
          </div>
          <button
            onClick={nextSlide}
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Stats below controls */}
        <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/10 max-w-lg">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-3xl lg:text-4xl font-display font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
