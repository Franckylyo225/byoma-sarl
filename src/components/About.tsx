import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import aboutImg1 from "@/assets/about-byoma.jpg";
import aboutImg2 from "@/assets/about-byoma-2.jpg";
import aboutImg3 from "@/assets/about-byoma-3.jpg";

const pillars = [
  {
    title: "Notre Mission",
    description: "Proposer des solutions fiables et durables dans les secteurs stratégiques, en plaçant la performance et la satisfaction client au cœur de notre engagement.",
  },
  {
    title: "Notre Vision",
    description: "Devenir un acteur de référence en Côte d'Ivoire et en Afrique de l'Ouest, reconnu pour l'excellence de ses services et la solidité de ses partenariats.",
  },
  {
    title: "Nos Valeurs",
    description: "Intégrité, professionnalisme et engagement responsable guident chacune de nos actions pour dépasser les attentes de nos clients et partenaires.",
  },
];

export function About() {
  const leftReveal = useScrollReveal({ threshold: 0.2 });
  const rightReveal = useScrollReveal({ threshold: 0.2 });

  return (
    <section id="apropos" className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Text */}
          <div
            ref={leftReveal.ref}
            className={`scroll-reveal ${leftReveal.isVisible ? "visible" : ""}`}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-accent" />
              <span className="text-sm font-medium tracking-[0.2em] uppercase text-accent">
                À propos
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
              Des solutions innovantes,{" "}
              <span className="text-accent italic">ensemble.</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              BYOMA SARL, filiale de BYOMA GROUP, créée en octobre 2023, est une entreprise
              à modèle de croissance diversifié, opérant dans plusieurs secteurs stratégiques
              à forte valeur ajoutée.
            </p>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Grâce à une gouvernance rigoureuse et à des partenariats solides, BYOMA SARL se
              positionne comme un acteur dynamique et structuré, capable d'intervenir efficacement
              aussi bien dans les secteurs énergétiques que dans l'immobilier et le commerce.
            </p>

            <Link to="/a-propos">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-6">
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            {/* Mission/Vision/Values */}
            <div className="mt-12 space-y-6">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="border-l-2 border-accent/30 pl-6">
                  <h4 className="font-display text-lg font-bold text-foreground mb-1">
                    {pillar.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Images grid */}
          <div
            ref={rightReveal.ref}
            className={`scroll-reveal-right ${rightReveal.isVisible ? "visible" : ""}`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <img
                  src={aboutImg1}
                  alt="Bureaux BYOMA"
                  className="w-full h-64 object-cover rounded-2xl"
                  loading="lazy"
                  width={1200}
                  height={800}
                />
              </div>
              <div>
                <img
                  src={aboutImg2}
                  alt="Projets immobiliers BYOMA"
                  className="w-full h-48 object-cover rounded-2xl"
                  loading="lazy"
                  width={800}
                  height={1000}
                />
              </div>
              <div>
                <img
                  src={aboutImg3}
                  alt="Secteur énergétique BYOMA"
                  className="w-full h-48 object-cover rounded-2xl"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-primary rounded-xl">
                <div className="text-3xl font-display font-bold text-accent">50+</div>
                <div className="text-xs text-primary-foreground/60 uppercase tracking-wider mt-1">Projets livrés</div>
              </div>
              <div className="text-center p-4 bg-primary rounded-xl">
                <div className="text-3xl font-display font-bold text-accent">3</div>
                <div className="text-xs text-primary-foreground/60 uppercase tracking-wider mt-1">Secteurs</div>
              </div>
              <div className="text-center p-4 bg-primary rounded-xl">
                <div className="text-3xl font-display font-bold text-accent">100%</div>
                <div className="text-xs text-primary-foreground/60 uppercase tracking-wider mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
