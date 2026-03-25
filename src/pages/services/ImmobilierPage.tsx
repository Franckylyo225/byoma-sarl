import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Building2, CheckCircle, ArrowRight, Home, Key, TrendingUp, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import serviceImmobilier from "@/assets/service-immobilier.jpg";

const features = [
  "Promotion de programmes immobiliers résidentiels",
  "Développement de projets commerciaux",
  "Gestion locative de biens immobiliers",
  "Conseil en investissement immobilier",
  "Accompagnement dans l'acquisition de biens",
  "Études de faisabilité et de marché",
  "Gestion de patrimoine immobilier",
  "Rénovation et valorisation de biens",
];

const benefits = [
  { icon: Home, title: "Projets de qualité", description: "Des programmes immobiliers conçus avec un souci d'excellence, alliant confort et élégance." },
  { icon: Key, title: "Accompagnement complet", description: "De la recherche du bien idéal à la remise des clés, nous sommes à vos côtés." },
  { icon: TrendingUp, title: "Rentabilité", description: "Des investissements optimisés pour une rentabilité durable et sécurisée." },
  { icon: Gem, title: "L'élégance", description: "L'expérience du confort et de l'élégance dans chacun de nos projets immobiliers." },
];

export default function ImmobilierPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={serviceImmobilier} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Building2 className="w-10 h-10" />
            </div>
            <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
              Nos Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Promotion et gestion immobilière
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              L'expérience du confort et de l'élégance — des projets immobiliers de qualité pour un cadre de vie exceptionnel.
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
                L'immobilier, un pilier de notre croissance
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                BYOMA SARL développe une activité de promotion et de gestion immobilière axée sur 
                la qualité, le confort et l'élégance. Nos projets immobiliers s'inscrivent dans une 
                démarche de valorisation du patrimoine urbain en Côte d'Ivoire.
              </p>
              <p className="text-muted-foreground text-lg mb-8">
                Que vous soyez investisseur, propriétaire ou locataire, BYOMA SARL vous accompagne 
                avec des solutions immobilières adaptées à vos ambitions. Notre approche allie 
                modernité architecturale, durabilité et rentabilité pour des investissements pérennes.
              </p>
              <Link to="/contact">
                <Button variant="premium" size="lg">
                  Découvrir nos projets
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src={serviceImmobilier} alt="Résidence moderne — promotion immobilière" className="w-full h-[400px] object-cover" />
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
              Un accompagnement sur mesure pour tous vos projets immobiliers.
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
              L'expérience BYOMA en immobilier
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
            Investissez dans l'immobilier avec BYOMA
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Découvrez nos programmes immobiliers en cours et nos opportunités d'investissement.
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