import { 
  ShoppingCart, 
  Fuel, 
  Building2, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";

const services = [
  {
    icon: ShoppingCart,
    title: "Négoce",
    description: "Activités de négoce diversifiées dans plusieurs secteurs stratégiques à forte valeur ajoutée, avec un réseau de partenaires solides.",
    features: ["Commerce", "Import-Export", "Distribution"],
    href: "/services/negoce",
  },
  {
    icon: Fuel,
    title: "Distribution des produits pétroliers et gaziers",
    description: "Distribution fiable et durable de produits pétroliers et gaziers, avec une logistique optimisée pour répondre aux besoins du marché.",
    features: ["Produits pétroliers", "Gaz", "Logistique"],
    href: "/services/distribution-petroliere",
  },
  {
    icon: Building2,
    title: "Promotion et gestion immobilière",
    description: "Promotion et gestion de biens immobiliers de qualité, alliant confort, élégance et durabilité pour une expérience unique.",
    features: ["Promotion", "Gestion locative", "Investissement"],
    href: "/services/immobilier",
  },
];

export function Services() {
  const headerReveal = useScrollReveal({ threshold: 0.2 });
  const { setRef, visibleItems } = useScrollRevealMultiple(services.length, { threshold: 0.15 });
  const ctaReveal = useScrollReveal({ threshold: 0.3 });

  return (
    <section id="services" className="section-padding bg-primary text-primary-foreground">
      <div className="container-custom">
        {/* Section Header */}
        <div 
          ref={headerReveal.ref}
          className={`text-center max-w-3xl mx-auto mb-16 scroll-reveal ${headerReveal.isVisible ? "visible" : ""}`}
        >
          <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
            Nos expertises
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Des solutions complètes pour vos{" "}
            <span className="text-primary-foreground">projets stratégiques</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            L'expérience du confort et de l'élégance. Découvrez nos services 
            dans les secteurs de l'énergie, du commerce et de l'immobilier.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={setRef(index)}
              className={`group bg-secondary rounded-2xl p-8 border border-border/20 hover:shadow-lg hover:border-primary/30 transition-all duration-300 scroll-reveal ${
                visibleItems[index] ? "visible" : ""
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold mb-3 text-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 line-clamp-3">
                {service.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {service.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1 bg-primary/10 rounded-full text-primary"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Link */}
              <Link
                to={service.href}
                className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div 
          ref={ctaReveal.ref}
          className={`text-center mt-12 scroll-reveal-scale ${ctaReveal.isVisible ? "visible" : ""}`}
        >
          <Link to="/contact">
            <Button variant="hero" size="lg">
              Nous contacter
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}