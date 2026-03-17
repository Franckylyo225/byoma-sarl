import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Building2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import serviceBtp from "@/assets/service-topographie-3.jpg";

const features = [
  "Construction de bâtiments",
  "Réhabilitation et rénovation",
  "Infrastructures routières",
  "Ouvrages hydrauliques",
  "Supervision de chantier",
  "Études techniques",
  "Gestion de projets BTP",
  "Contrôle qualité",
];

const benefits = [
  { title: "Qualité garantie", description: "Respect des normes de construction et des délais convenus" },
  { title: "Équipes qualifiées", description: "Personnel formé et expérimenté dans tous les corps de métier" },
  { title: "Matériaux certifiés", description: "Utilisation de matériaux de qualité supérieure" },
  { title: "Suivi rigoureux", description: "Supervision continue et rapports d'avancement réguliers" },
];

export default function BtpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Building2 className="w-10 h-10" />
            </div>
            <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
              Nos Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bâtiment & Travaux Publics
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Construction et réhabilitation de bâtiments, infrastructures de qualité pour vos projets.
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
                Des constructions durables et de qualité
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Notre division BTP vous accompagne dans la réalisation de tous vos projets de construction, 
                qu'il s'agisse de bâtiments résidentiels, commerciaux ou d'infrastructures publiques.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                Nous mettons à votre disposition notre expertise technique et notre savoir-faire 
                pour garantir des réalisations conformes à vos attentes et aux normes en vigueur.
              </p>
              <Link to="/contact">
                <Button variant="premium" size="lg">
                  Demander un devis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-premium">
              <img src={serviceBtp} alt="Techniciens ANE SARL avec équipement de mesure sur chantier" className="w-full h-full object-cover" />
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
              Une expertise complète dans le domaine du bâtiment et des travaux publics.
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
              Nos engagements
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
