import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, Star, Loader2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string | null;
  organization: string | null;
  rating: number | null;
  image_url: string | null;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const headerReveal = useScrollReveal({ threshold: 0.2 });
  const cardReveal = useScrollReveal({ threshold: 0.2 });

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('id, content, author, role, organization, rating, image_url')
        .eq('published', true)
        .order('display_order', { ascending: true });
      
      setTestimonials(data || []);
      setIsLoading(false);
    };
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Don't render if no testimonials
  if (!isLoading && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <div 
          ref={headerReveal.ref}
          className={`text-center max-w-3xl mx-auto mb-16 scroll-reveal ${headerReveal.isVisible ? "visible" : ""}`}
        >
          <span className="inline-block text-copper font-semibold text-sm uppercase tracking-widest mb-4">
            Témoignages
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ce que disent nos <span className="text-primary">clients</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez les retours d'expérience de nos partenaires et clients 
            qui nous font confiance depuis des années.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div 
          ref={cardReveal.ref}
          className={`max-w-4xl mx-auto scroll-reveal-scale ${cardReveal.isVisible ? "visible" : ""}`}
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="relative bg-card rounded-2xl shadow-premium-lg p-8 md:p-12">
              {/* Quote icon */}
              <div className="absolute -top-6 left-8 w-12 h-12 bg-copper rounded-xl flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-accent-foreground" />
              </div>

              {/* Content */}
              <div className="mt-4">
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex]?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-copper text-copper" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground text-lg md:text-xl leading-relaxed mb-8 font-display italic">
                  "{testimonials[currentIndex]?.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {testimonials[currentIndex]?.image_url ? (
                    <img
                      src={testimonials[currentIndex].image_url!}
                      alt={testimonials[currentIndex].author}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-copper/20"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center ring-2 ring-copper/20">
                      <Quote className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-foreground">
                      {testimonials[currentIndex]?.author}
                    </div>
                    {testimonials[currentIndex]?.role && (
                      <div className="text-sm text-muted-foreground">
                        {testimonials[currentIndex].role}
                      </div>
                    )}
                    {testimonials[currentIndex]?.organization && (
                      <div className="text-sm text-copper font-medium">
                        {testimonials[currentIndex].organization}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              {testimonials.length > 1 && (
                <div className="absolute bottom-8 right-8 flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Dots */}
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-copper w-6"
                          : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
