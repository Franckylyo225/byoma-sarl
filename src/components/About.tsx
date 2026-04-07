import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import aboutImg1 from "@/assets/about-byoma.jpg";
import aboutImg2 from "@/assets/about-byoma-2.jpg";
import aboutImg3 from "@/assets/about-byoma-3.jpg";

const stats = [
  { value: 50, suffix: "+", label: "Projets livrés" },
  { value: 3, suffix: "+", label: "Secteurs d'activité" },
  { value: 100, suffix: "%", label: "Satisfaction client" },
  { value: null, suffix: "∞", label: "Ambitions" },
];

function AnimatedCounter({ value, suffix, trigger }: { value: number; suffix: string; trigger: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    setCount(0);
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [trigger, value]);

  return <>{count}{suffix}</>;
}

export function About() {
  const leftReveal = useScrollReveal({ threshold: 0.2 });
  const rightReveal = useScrollReveal({ threshold: 0.2 });
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

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
          </div>
        </div>

        {/* Stats - full width animated */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-border"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="text-4xl lg:text-5xl font-display font-bold text-accent mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} trigger={statsVisible} />
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
