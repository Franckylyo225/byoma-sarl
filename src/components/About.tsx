import { Button } from "@/components/ui/button";
import { Award, Users, Target, ArrowRight } from "lucide-react";
import aboutImage from "@/assets/about-ane.png";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "Nous visons l'excellence dans chaque projet, avec des standards de qualité irréprochables.",
  },
  {
    icon: Users,
    title: "Engagement",
    description: "Nous sommes engagés auprès de nos clients et partenaires pour leur satisfaction totale.",
  },
  {
    icon: Target,
    title: "Innovation",
    description: "Nous intégrons les dernières technologies pour des solutions modernes et efficaces.",
  },
];

export function About() {
  const imageReveal = useScrollReveal({ threshold: 0.2 });
  const contentReveal = useScrollReveal({ threshold: 0.2 });
  const { setRef, visibleItems } = useScrollRevealMultiple(values.length, { threshold: 0.2 });

  return (
    <section id="apropos" className="section-padding bg-secondary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-copper/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-muted/50 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Image */}
          <div 
            ref={imageReveal.ref}
            className={`relative order-2 lg:order-1 scroll-reveal-left ${imageReveal.isVisible ? "visible" : ""}`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-premium-lg">
              <img
                src={aboutImage}
                alt="Expert ANE SARL"
                className="w-full h-[500px] object-cover object-top"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-copper/30 rounded-2xl -z-10" />
            {/* Stats badge */}
            <div className="absolute -bottom-6 -left-6 bg-copper text-primary-foreground px-6 py-4 rounded-xl shadow-premium">
              <div className="text-3xl font-bold font-display">10</div>
              <div className="text-sm opacity-90">Années d'expérience</div>
            </div>
          </div>

          {/* Content */}
          <div 
            ref={contentReveal.ref}
            className={`order-1 lg:order-2 scroll-reveal-right ${contentReveal.isVisible ? "visible" : ""}`}
          >
            <span className="inline-block text-copper font-semibold text-sm uppercase tracking-widest mb-4">
              À propos de nous
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Expert en aménagement,{" "}
              <span className="text-primary">artisan de votre succès</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Notre mission est de valoriser et de transformer les espaces fonciers et forestiers 
              en solutions durables et harmonieuses, en alliant innovation, respect de l'environnement 
              et satisfaction client.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nous nous engageons à accompagner nos partenaires dans la réalisation de leurs projets, 
              tout en contribuant à un avenir équilibré entre développement humain et préservation 
              des ressources naturelles.
            </p>

            <Button variant="premium" size="lg">
              Découvrir notre histoire
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Values - Now at the bottom */}
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              ref={setRef(index)}
              className={`bg-card backdrop-blur-sm border border-border rounded-xl p-6 hover:border-copper/30 transition-all duration-300 shadow-premium group scroll-reveal ${
                visibleItems[index] ? "visible" : ""
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-copper/20 transition-colors">
                  <value.icon className="w-7 h-7 text-primary group-hover:text-copper transition-colors" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
