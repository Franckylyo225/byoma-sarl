import { ShoppingCart, Fuel, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";
import serviceNegoce from "@/assets/service-negoce.jpg";
import serviceDistribution from "@/assets/service-distribution.jpg";
import serviceImmobilier from "@/assets/service-immobilier.jpg";

const services = [
  {
    icon: ShoppingCart,
    num: "01",
    title: "Négoce",
    description: "Import-export dans des secteurs stratégiques à forte valeur ajoutée. Nous développons un réseau de partenaires solides pour répondre aux exigences du marché international.",
    features: ["Commerce international", "Import-Export", "Sourcing stratégique"],
    href: "/services/negoce",
    image: serviceNegoce,
  },
  {
    icon: Fuel,
    num: "02",
    title: "Distribution pétrolière & gazière",
    description: "Distribution fiable et durable de produits pétroliers et gaziers, avec une logistique optimisée pour accompagner la croissance économique régionale.",
    features: ["Produits pétroliers", "Gaz industriel", "Logistique optimisée"],
    href: "/services/distribution-petroliere",
    image: serviceDistribution,
  },
  {
    icon: Building2,
    num: "03",
    title: "Promotion & gestion immobilière",
    description: "Promotion et gestion de biens immobiliers de qualité, alliant confort, élégance et durabilité pour une expérience résidentielle et commerciale unique.",
    features: ["Promotion immobilière", "Gestion locative", "Investissement"],
    href: "/services/immobilier",
    image: serviceImmobilier,
  },
];

export function Services() {
  const headerReveal = useScrollReveal({ threshold: 0.2 });
  const { setRef, visibleItems } = useScrollRevealMultiple(services.length, { threshold: 0.15 });

  return (
    <section id="services" className="section-padding bg-primary text-primary-foreground">
      <div className="container-custom">
        {/* Header */}
        <div
          ref={headerReveal.ref}
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6 scroll-reveal ${headerReveal.isVisible ? "visible" : ""}`}
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-accent" />
              <span className="text-sm font-medium tracking-[0.2em] uppercase text-accent">
                Nos expertises
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Des solutions complètes pour{" "}
              <span className="text-accent italic">vos projets.</span>
            </h2>
          </div>
          <Link to="/contact" className="shrink-0">
            <button className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors uppercase tracking-wider">
              Nous contacter
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Service cards */}
        <div className="space-y-6">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.href}
              ref={setRef(index)}
              className={`group grid md:grid-cols-[auto_1fr_300px] gap-6 md:gap-8 items-center p-6 md:p-8 rounded-2xl border border-primary-foreground/10 hover:border-accent/30 hover:bg-primary-foreground/5 transition-all duration-500 scroll-reveal ${
                visibleItems[index] ? "visible" : ""
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Number */}
              <div className="flex items-center gap-6">
                <span className="text-5xl font-display font-bold text-accent/20 group-hover:text-accent/40 transition-colors">
                  /{service.num}/
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-display text-2xl font-bold mb-3 text-primary-foreground group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-primary-foreground/60 mb-4 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((f, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1 bg-accent/10 rounded-full text-accent">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="hidden md:block rounded-xl overflow-hidden h-40">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
