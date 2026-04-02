import { Zap, Globe, Shield, TrendingUp } from "lucide-react";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";

const pillars = [
  {
    icon: Globe,
    title: "Présence multisectorielle",
    description: "Nous opérons dans l'énergie, l'immobilier et le commerce, anticipant les besoins du marché avec agilité et expertise.",
  },
  {
    icon: Shield,
    title: "Gouvernance rigoureuse",
    description: "Une structure solide et transparente garantissant la fiabilité et la sécurité de chaque engagement pris.",
  },
  {
    icon: TrendingUp,
    title: "Croissance durable",
    description: "Un modèle économique diversifié, conçu pour une performance pérenne et un impact positif.",
  },
  {
    icon: Zap,
    title: "Réactivité & Innovation",
    description: "Une capacité d'intervention rapide pour saisir les opportunités et proposer des solutions innovantes.",
  },
];

export function WhyByoma() {
  const headerReveal = useScrollReveal({ threshold: 0.2 });
  const { setRef, visibleItems } = useScrollRevealMultiple(pillars.length, { threshold: 0.15 });

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div
          ref={headerReveal.ref}
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6 scroll-reveal ${headerReveal.isVisible ? "visible" : ""}`}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-accent" />
              <span className="text-sm font-medium tracking-[0.2em] uppercase text-accent">
                Pourquoi nous choisir
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              La valeur ajoutée{" "}
              <span className="text-accent italic">BYOMA.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              ref={setRef(index)}
              className={`group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-500 scroll-reveal text-center ${
                visibleItems[index] ? "visible" : ""
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                <pillar.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
