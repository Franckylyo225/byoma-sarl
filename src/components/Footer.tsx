import { Link } from "react-router-dom";
import { Facebook, Linkedin, Twitter, Instagram, MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import logoByoma from "@/assets/logo-byoma.png";

const quickLinks = [
  { name: "Accueil", href: "/" },
  { name: "Projets", href: "/projets" },
  { name: "À propos", href: "/a-propos" },
  { name: "Actualités", href: "/actualites" },
  { name: "Contact", href: "/contact" },
];

const serviceLinks = [
  { name: "Négoce", href: "/services/negoce" },
  { name: "Distribution pétrolière", href: "/services/distribution-petroliere" },
  { name: "Gestion immobilière", href: "/services/immobilier" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Banner */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-custom py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Prêt à collaborer ?
            </h3>
            <p className="text-primary-foreground/60">
              Contactez-nous pour discuter de votre prochain projet.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-accent text-accent-foreground px-8 py-4 font-semibold hover:bg-accent/90 transition-colors rounded-lg whitespace-nowrap"
          >
            Nous contacter
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="inline-block mb-6">
              <img src={logoByoma} alt="BYOMA SARL" className="h-12 w-auto brightness-0 invert" />
            </Link>
            <p className="text-primary-foreground/50 text-xs uppercase tracking-wider mb-3">
              Filiale de BYOMA GROUP
            </p>
            <p className="text-primary-foreground/60 mb-6 leading-relaxed text-sm">
              Partenaire multisectoriel engagé pour des solutions fiables et durables.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <Link to={l.href} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((l, i) => (
                <li key={i}>
                  <Link to={l.href} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/60">
                  Cocody plateau Dokui, SOPIM<br />05 BP 3320 Abidjan 05
                </span>
              </li>
              <li>
                <a href="tel:+2252722251544" className="flex items-center gap-3 text-primary-foreground/60 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4 text-accent" />
                  27 22 25 15 44
                </a>
              </li>
              <li>
                <a href="tel:+2250716342901" className="flex items-center gap-3 text-primary-foreground/60 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4 text-accent" />
                  07 16 34 29 01
                </a>
              </li>
              <li>
                <a href="mailto:info@byoma.ci" className="flex items-center gap-3 text-primary-foreground/60 hover:text-accent transition-colors">
                  <Mail className="w-4 h-4 text-accent" />
                  info@byoma.ci
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/40 text-xs">
            © {new Date().getFullYear()} BYOMA SARL — Filiale de BYOMA GROUP. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-xs text-primary-foreground/40">
            <a href="#" className="hover:text-accent transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-accent transition-colors">Confidentialité</a>
            <Link to="/admin" className="hover:text-accent transition-colors">Administration</Link>
          </div>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-all"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
