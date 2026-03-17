import { Shield, Award, Users, Leaf } from "lucide-react";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";

const badges = [
  {
    icon: Shield,
    title: "Certifié ISO",
    description: "Normes internationales de qualité",
  },
  {
    icon: Award,
    title: "10 Ans",
    description: "D'expérience sur le terrain",
  },
  {
    icon: Users,
    title: "500+ Projets",
    description: "Réalisés avec succès",
  },
  {
    icon: Leaf,
    title: "Éco-responsable",
    description: "Engagement environnemental",
  },
];

export function TrustBadges() {
  const { setRef, visibleItems } = useScrollRevealMultiple(badges.length, { threshold: 0.2 });

  return (
    <section className="py-12 bg-muted border-y border-border">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              ref={setRef(index)}
              className={`flex flex-col items-center text-center group scroll-reveal-scale ${
                visibleItems[index] ? "visible" : ""
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-copper/10 transition-colors">
                <badge.icon className="w-8 h-8 text-primary group-hover:text-copper transition-colors" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-1">
                {badge.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
