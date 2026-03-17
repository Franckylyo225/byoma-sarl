import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShoppingCart, CheckCircle, ArrowRight, TrendingUp, Globe, Handshake, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import serviceNegoce from "@/assets/service-negoce.jpg";

const features = [
  "Import-export de marchandises diversifiées",
  "Sourcing international de produits",
  "Gestion de la chaîne d'approvisionnement",
  "Négociation et intermédiation commerciale",
  "Conformité douanière et réglementaire",
  "Logistique et transport de marchandises",
  "Analyse de marché et veille concurrentielle",
  "Partenariats commerciaux stratégiques",
];

const benefits = [
  { icon: Globe, title: "Réseau international", description: "Un réseau de fournisseurs et partenaires à l'échelle mondiale pour des approvisionnements fiables." },
  { icon: TrendingUp, title: "Compétitivité", description: "Des prix compétitifs grâce à nos volumes d'achat et notre expertise en négociation." },
  { icon: Handshake, title: "Confiance", description: "Des relations commerciales fondées sur la transparence et la fiabilité." },
  { icon: BarChart3, title: "Performance", description: "Un suivi rigoureux des opérations pour garantir la qualité et les délais." },
];

export default function NegocePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={serviceNegoce} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <ShoppingCart className="w-10 h-10" />
            </div>
            <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
              Nos Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Négoce
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Activités de négoce diversifiées dans plusieurs secteurs stratégiques, avec un réseau de partenaires solides à l'international.
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
                Un acteur clé du commerce en Côte d'Ivoire
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                BYOMA SARL s'impose comme un partenaire de référence dans le négoce en Côte d'Ivoire 
                et en Afrique de l'Ouest. Notre expertise couvre l'ensemble de la chaîne commerciale, 
                de l'identification des opportunités à la livraison finale des marchandises.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                Grâce à notre connaissance approfondie des marchés locaux et internationaux, nous 
                offrons à nos clients un accès privilégié à des produits de qualité à des prix 
                compétitifs, tout en assurant la conformité réglementaire et la sécurité des transactions.
              </p>
              <Link to="/contact">
                <Button variant="premium" size="lg">
                  Nous contacter
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-premium-lg">
              <img src={serviceNegoce} alt="Activités de négoce — port et conteneurs" className="w-full h-[400px] object-cover" />
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
              Une offre complète pour répondre à vos besoins commerciaux.
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
              Pourquoi choisir BYOMA pour le négoce ?
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
            Un besoin en négoce ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de vos besoins commerciaux et découvrir comment BYOMA SARL peut vous accompagner.
          </p>
          <Link to="/contact">
            <Button variant="premium" size="xl">
              Nous contacter
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