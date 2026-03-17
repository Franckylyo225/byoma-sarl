import { Zap, Globe, Shield, TrendingUp } from "lucide-react";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";
import heroCity from "@/assets/hero-byoma-city.jpg";

const pillars = [
  {
    icon: Globe,
    title: "Présence multisectorielle",
    description: "Nous opérons dans l'énergie, l'immobilier et le commerce, anticipant les besoins du marché.",
  },
  {
    icon: Shield,
    title: "Gouvernance rigoureuse",
    description: "Une structure solide et transparente pour garantir la fiabilité de chaque engagement.",
  },
  {
    icon: TrendingUp,
    title: "Croissance durable",
    description: "Un modèle économique diversifié, conçu pour une performance pérenne.",
  },
  {
    icon: Zap,
    title: "Réactivité",
    description: "Une capacité d'intervention rapide pour saisir les opportunités du marché.",
  },
];

export function WhyByoma() {
  const headerReveal = useScrollReveal({ threshold: 0.2 });
  const { setRef, visibleItems } = useScrollRevealMultiple(pillars.length, { threshold: 0.15 });

  return (
    <section className="relative section-padding bg-background overflow-hidden">
      {/* Background image accent */}
      <div className="absolute inset-0 opacity-[0.03]">
        <img src={heroCity} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="container-custom relative z-10">
        <div 
          ref={headerReveal.ref}
          className={`text-center max-w-3xl mx-auto mb-16 scroll-reveal ${headerReveal.isVisible ? "visible" : ""}`}
        >
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-4">
            Filiale de BYOMA GROUP
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Pourquoi choisir{" "}
            <span className="text-primary">BYOMA SARL ?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Un acteur dynamique et structuré, capable d'intervenir efficacement 
            dans les secteurs clés de l'économie ivoirienne.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              ref={setRef(index)}
              className={`group relative bg-card rounded-2xl p-8 border border-border hover:border-accent/20 transition-all duration-500 shadow-premium scroll-reveal ${
                visibleItems[index] ? "visible" : ""
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {/* Accent line */}
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                  <pillar.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}