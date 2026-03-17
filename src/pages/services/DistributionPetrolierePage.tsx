import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Fuel, CheckCircle, ArrowRight, Shield, Truck, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import serviceDistribution from "@/assets/service-distribution.jpg";

const features = [
  "Distribution de carburants (essence, diesel, kérosène)",
  "Approvisionnement en gaz butane et propane",
  "Livraison en vrac et en détail",
  "Gestion de stations-service",
  "Stockage sécurisé de produits pétroliers",
  "Transport spécialisé de matières dangereuses",
  "Audit et conseil en gestion énergétique",
  "Conformité aux normes HSE",
];

const benefits = [
  { icon: Shield, title: "Sécurité", description: "Respect strict des normes de sécurité et de la réglementation dans le transport et le stockage des produits." },
  { icon: Truck, title: "Logistique fiable", description: "Une flotte moderne et un réseau logistique optimisé pour des livraisons ponctuelles et sécurisées." },
  { icon: Clock, title: "Disponibilité", description: "Un service d'approvisionnement réactif pour garantir la continuité de vos activités énergétiques." },
  { icon: Award, title: "Qualité certifiée", description: "Des produits conformes aux standards internationaux, contrôlés à chaque étape de la chaîne." },
];

export default function DistributionPetrolierePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={serviceDistribution} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Fuel className="w-10 h-10" />
            </div>
            <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
              Nos Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Distribution pétrolière et gazière
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Distribution fiable et durable de produits pétroliers et gaziers, avec une logistique optimisée pour le marché ivoirien.
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
                L'énergie au service de votre développement
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                BYOMA SARL intervient dans la distribution de produits pétroliers et gaziers avec une 
                approche orientée vers la performance et la durabilité. Notre expertise couvre l'ensemble 
                de la chaîne de valeur, de l'approvisionnement au stockage, en passant par la distribution.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                Forte de partenariats solides avec les principaux acteurs du secteur énergétique, 
                BYOMA SARL garantit un approvisionnement régulier et sécurisé en carburants et en gaz, 
                répondant aux besoins des entreprises, des collectivités et des particuliers.
              </p>
              <Link to="/contact">
                <Button variant="premium" size="lg">
                  Nous contacter
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-premium-lg">
              <img src={serviceDistribution} alt="Camions citernes — distribution pétrolière" className="w-full h-[400px] object-cover" />
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
              Une gamme complète de services énergétiques pour accompagner votre croissance.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-card rounded-xl p-6 shadow-sm border border-border hover:border-accent/30 transition-colors">
                <CheckCircle className="w-6 h-6 text-accent mb-4" />
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
              Pourquoi choisir BYOMA pour l'énergie ?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7" />
                </div>
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
            Besoin en produits pétroliers ou gaziers ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Contactez-nous pour un devis personnalisé et un approvisionnement adapté à vos besoins.
          </p>
          <Link to="/contact">
            <Button variant="premium" size="xl">
              Demander un devis
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}