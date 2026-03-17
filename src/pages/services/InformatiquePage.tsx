import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Monitor, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import serviceInformatique from "@/assets/service-informatique.jpg";

const features = [
  "Développement de sites web",
  "Applications métiers",
  "Maintenance informatique",
  "Fourniture d'équipements",
  "Formation et accompagnement",
  "Solutions cloud",
  "Sécurité informatique",
  "Support technique",
];

const benefits = [
  { title: "Solutions modernes", description: "Technologies web et logicielles de dernière génération" },
  { title: "Sur mesure", description: "Applications développées selon vos besoins spécifiques" },
  { title: "Support réactif", description: "Assistance technique rapide et efficace" },
  { title: "Formation incluse", description: "Accompagnement pour la prise en main des outils" },
];

export default function InformatiquePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Monitor className="w-10 h-10" />
            </div>
            <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
              Nos Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Informatique
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Développement web, maintenance informatique et fourniture de matériels de qualité.
            </p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Solutions digitales pour votre entreprise
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Notre département informatique vous propose des solutions technologiques 
                adaptées aux besoins de votre organisation : développement web, applications 
                métiers, infrastructure et maintenance.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                Nous développons notamment des outils spécialisés pour le secteur de l'aménagement 
                et de la géomatique, permettant une gestion optimisée de vos projets et données.
              </p>
              <Link to="/contact">
                <Button variant="premium" size="lg">
                  Demander un devis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-premium">
              <img src={serviceInformatique} alt="Création de sites web et développement informatique" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos prestations
            </h2>
            <p className="text-muted-foreground text-lg">
              Des services informatiques complets pour accompagner votre transformation digitale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <CheckCircle className="w-6 h-6 text-primary mb-4" />
                <p className="text-foreground font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Nos avantages
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="text-center">
                <h3 className="font-display text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-primary-foreground/80">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-20">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour une étude personnalisée et un devis gratuit.
          </p>
          <Link to="/contact">
            <Button variant="premium" size="xl">
              Demander un devis gratuit
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
