import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Compass, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import serviceTopographie from "@/assets/service-topographie-4.jpg";

const features = [
  "Levés topographiques",
  "Bornage et délimitation",
  "Calculs de surfaces",
  "Plans cadastraux",
  "Modélisation 3D du terrain",
  "Implantation d'ouvrages",
  "Nivellement de précision",
  "Suivi de déformation",
];

const benefits = [
  { title: "Précision millimétrique", description: "Équipements de dernière génération pour des mesures exactes" },
  { title: "Équipe certifiée", description: "Géomètres-experts et techniciens qualifiés" },
  { title: "Rapidité d'exécution", description: "Délais optimisés sans compromis sur la qualité" },
  { title: "Documentation complète", description: "Rapports détaillés et plans conformes aux normes" },
];

export default function TopographiePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Compass className="w-10 h-10" />
            </div>
            <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
              Nos Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Topographie
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Relevés topographiques précis, calculs de surface et modélisation géométrique avancée.
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
                Mesures précises pour des projets réussis
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Notre service de topographie vous offre des relevés de terrain d'une précision 
                exceptionnelle, indispensables pour la réussite de vos projets de construction, 
                d'aménagement ou de délimitation.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                Équipés des dernières technologies (stations totales, GPS RTK, drones), 
                nos géomètres-experts garantissent des résultats fiables et conformes 
                aux exigences réglementaires.
              </p>
              <Link to="/contact">
                <Button variant="premium" size="lg">
                  Demander un devis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-premium">
              <img src={serviceTopographie} alt="Technicien topographe avec équipement de mesure" className="w-full h-full object-cover" />
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
              Des services topographiques complets pour tous types de projets.
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
              Nos atouts
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
