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


const stats = [
  { value: "10", label: "Années d'expérience" },
  { value: "500+", label: "Projets réalisés" },
  { value: "72", label: "Forêts classées" },
  { value: "50+", label: "Experts qualifiés" },
];

const teamImages = [
  { src: teamDroneImage, alt: "Expert en pilotage de drone" },
  { src: teamWorkImage, alt: "Équipe sur le terrain" },
  { src: teamGroupImage, alt: "Équipe de topographes" },
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
              Expert en aménagement, artisan de votre succès
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Depuis 2015, ANE SARL accompagne les acteurs publics et privés dans leurs projets d'aménagement.
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
              Notre histoire
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Créée en 2015, ANE SARL a démarré avec une vision claire : apporter des solutions expertes et personnalisées 
              dans les domaines de l'aménagement foncier, forestier, BTP, topographie, géomatique. Au fil des années, 
              nous avons élargi notre champ d'expertise pour répondre aux besoins variés de nos clients tout en gardant 
              une approche humaine et centrée sur l'excellence.
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
              <div className="relative rounded-2xl overflow-hidden shadow-premium-lg">
                <img
                  src={aboutImage}
                  alt="Équipe ANE SARL"
                  className="w-full h-[500px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-copper/30 rounded-2xl -z-10" />
            </div>

            {/* Content */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Notre mission
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
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  Expertise reconnue en aménagement foncier et forestier
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  Équipe pluridisciplinaire de professionnels qualifiés
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  Technologies de pointe pour des résultats précis
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
                className={`bg-card border border-border rounded-2xl p-8 hover:border-copper/30 transition-all duration-300 shadow-premium group text-center scroll-reveal ${
                  valuesVisible[index] ? "visible" : ""
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-copper/20 transition-colors">
                  <value.icon className="w-8 h-8 text-primary group-hover:text-copper transition-colors" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre équipe */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div 
            ref={teamReveal.ref}
            className={`text-center max-w-4xl mx-auto mb-12 scroll-reveal ${teamReveal.isVisible ? "visible" : ""}`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
              <UsersRound className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Notre équipe
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Derrière ANE SARL, une équipe d'experts passionnés et dévoués. Chaque membre apporte une expertise unique, 
              que ce soit dans la topographie, la géomatique, l'aménagement ou la gestion informatique. 
              Ensemble, nous travaillons pour vous offrir des solutions adaptées et innovantes.
            </p>
          </div>

          {/* Team Images Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {teamImages.map((image, index) => (
              <div 
                key={index}
                ref={setTeamImageRef(index)}
                className={`relative rounded-2xl overflow-hidden shadow-premium-lg group scroll-reveal ${
                  teamImagesVisible[index] ? "visible" : ""
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-primary-foreground font-semibold">{image.alt}</p>
                </div>
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
