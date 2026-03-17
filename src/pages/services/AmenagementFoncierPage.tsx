import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Map, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import serviceAmenagement from "@/assets/service-topographie-1.jpg";

const features = [
  "Études d'urbanisme et de faisabilité",
  "Lotissement et morcellement",
  "Valorisation foncière",
  "Conseil en investissement immobilier",
  "Accompagnement administratif",
  "Études d'impact environnemental",
  "Coordination avec les autorités locales",
  "Optimisation des espaces",
];

const benefits = [
  { title: "Expertise reconnue", description: "10 ans d'expérience dans l'aménagement foncier en Côte d'Ivoire depuis 2015" },
  { title: "Conformité légale", description: "Respect strict des réglementations et normes en vigueur" },
  { title: "Valorisation optimale", description: "Maximisation de la valeur de vos terrains et propriétés" },
  { title: "Accompagnement complet", description: "De l'étude préliminaire à la réalisation finale du projet" },
];

export default function AmenagementFoncierPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Map className="w-10 h-10" />
            </div>
            <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
              Nos Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Aménagement Foncier
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Conseils en urbanisme, gestion de projets de lotissement et valorisation optimale de vos terrains.
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
                Expertise en aménagement et valorisation foncière
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Notre équipe d'experts vous accompagne dans tous vos projets d'aménagement foncier, 
                de la conception à la réalisation. Nous offrons des solutions sur mesure adaptées 
                à vos besoins spécifiques et aux réalités du terrain ivoirien.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                Grâce à notre connaissance approfondie des réglementations locales et notre réseau 
                de partenaires, nous garantissons des projets conformes et optimisés pour maximiser 
                la valeur de vos investissements fonciers.
              </p>
              <Link to="/contact">
                <Button variant="premium" size="lg">
                  Demander un devis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-premium">
              <img src={serviceAmenagement} alt="Équipe ANE SARL sur le terrain avec équipement topographique" className="w-full h-full object-cover" />
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
              Une gamme complète de services pour répondre à tous vos besoins en aménagement foncier.
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
              Pourquoi nous choisir ?
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
