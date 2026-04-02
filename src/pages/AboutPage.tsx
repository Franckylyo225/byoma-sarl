import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Award, Users, Target, ArrowRight, CheckCircle, History, UsersRound } from "lucide-react";
import aboutImage from "@/assets/about-team.jpg";
import teamDroneImage from "@/assets/team-drone.jpg";
import teamWorkImage from "@/assets/team-work.jpg";
import teamGroupImage from "@/assets/team-group.jpg";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";

const values = [
  {
    icon: Award,
    title: "Performance",
    description: "Une vision orientée vers la performance et la durabilité dans chacun de nos secteurs d'activité.",
  },
  {
    icon: Users,
    title: "Partenariats",
    description: "Des partenariats solides pour intervenir efficacement dans l'énergie, l'immobilier et le commerce.",
  },
  {
    icon: Target,
    title: "Diversification",
    description: "Un modèle de croissance diversifié opérant dans plusieurs secteurs stratégiques à forte valeur ajoutée.",
  },
];

const stats = [
  { value: "2023", label: "Année de création" },
  { value: "3", label: "Secteurs d'activité" },
  { value: "100%", label: "Engagement qualité" },
  { value: "∞", label: "Ambitions" },
];

const teamImages = [
  { src: teamDroneImage, alt: "Secteur énergétique" },
  { src: teamWorkImage, alt: "Équipe sur le terrain" },
  { src: teamGroupImage, alt: "Équipe BYOMA" },
];

export default function AboutPage() {
  const historyReveal = useScrollReveal({ threshold: 0.2 });
  const teamReveal = useScrollReveal({ threshold: 0.2 });
  const { setRef: setTeamImageRef, visibleItems: teamImagesVisible } = useScrollRevealMultiple(3, { threshold: 0.2 });
  const { setRef: setValueRef, visibleItems: valuesVisible } = useScrollRevealMultiple(values.length, { threshold: 0.2 });
  const missionReveal = useScrollReveal({ threshold: 0.2 });
  const statsReveal = useScrollReveal({ threshold: 0.2 });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
              À Propos
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Partenaire multisectoriel, solutions durables
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              BYOMA SARL, filiale de BYOMA GROUP, est engagée pour des solutions fiables et durables depuis 2023.
            </p>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div 
            ref={historyReveal.ref}
            className={`max-w-4xl mx-auto text-center scroll-reveal ${historyReveal.isVisible ? "visible" : ""}`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
              <History className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Présentation de l'entreprise
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              BYOMA SARL, filiale de BYOMA GROUP, créée en octobre 2023, est une entreprise à modèle de croissance 
              diversifié, opérant dans plusieurs secteurs stratégiques à forte valeur ajoutée. Forte d'une vision 
              orientée vers la performance et la durabilité, BYOMA SARL développe des activités complémentaires 
              lui permettant d'anticiper les besoins du marché et de saisir des opportunités dans des domaines 
              clés de l'économie.
            </p>
          </div>
        </div>
      </section>

      {/* About Content - Mission */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div 
            ref={missionReveal.ref}
            className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center scroll-reveal ${missionReveal.isVisible ? "visible" : ""}`}
          >
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={aboutImage}
                  alt="Équipe BYOMA SARL"
                  className="w-full h-[500px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent/30 rounded-2xl -z-10" />
            </div>

            {/* Content */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Notre vision
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Grâce à une gouvernance rigoureuse et à des partenariats solides, BYOMA SARL se 
                positionne comme un acteur dynamique et structuré, capable d'intervenir efficacement 
                aussi bien dans les secteurs énergétiques que dans l'immobilier, le commerce et l'événementiel.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                L'expérience du confort et de l'élégance — notre engagement envers chaque client 
                et partenaire pour des solutions qui dépassent les attentes.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  Négoce et commerce diversifié
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  Distribution de produits pétroliers et gaziers
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  Promotion et gestion immobilière
                </li>
              </ul>

              <Button variant="premium" size="lg">
                Contactez-nous
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section 
        ref={statsReveal.ref}
        className={`bg-primary text-primary-foreground py-16 scroll-reveal ${statsReveal.isVisible ? "visible" : ""}`}
      >
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold font-display mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos valeurs
            </h2>
            <p className="text-muted-foreground text-lg">
              Les principes qui guident notre action au quotidien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                ref={setValueRef(index)}
                className={`bg-card border border-border rounded-2xl p-8 hover:border-accent/30 transition-all duration-300 shadow-md group text-center scroll-reveal ${
                  valuesVisible[index] ? "visible" : ""
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <value.icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}