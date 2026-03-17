import { Link } from "react-router-dom";
import { 
  Facebook, 
  Linkedin, 
  Twitter, 
  Instagram,
  MapPin,
  Phone,
  Mail,
  ArrowUp
} from "lucide-react";
import logoAne from "@/assets/logo-ane-full.png";

const quickLinks = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Projets", href: "/projets" },
  { name: "À propos", href: "/a-propos" },
  { name: "Contact", href: "/contact" },
  { name: "Administration", href: "/admin" },
];

const services = [
  "Aménagement Foncier",
  "Aménagement Forestier",
  "Bâtiment & Travaux Publics",
  "Topographie",
  "Géomatique",
  "Informatique",
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-ane-green-dark text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src={logoAne} 
                alt="ANE SARL" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-primary-foreground/70 mb-6 leading-relaxed">
              Votre partenaire de confiance pour un aménagement durable 
              des terres et forêts en Côte d'Ivoire.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-copper hover:text-accent-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Navigation</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-copper transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Nos Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#services"
                    className="text-primary-foreground/70 hover:text-copper transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-copper flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70">
                  Cocody Angré, Dokui Djomi<br />
                  11 BP 2917 Abidjan 17
                </span>
              </li>
              <li>
                <a href="tel:+2250768087101" className="flex items-center gap-3 text-primary-foreground/70 hover:text-copper transition-colors">
                  <Phone className="w-5 h-5 text-copper" />
                  +225 07 68 08 71 01
                </a>
              </li>
              <li>
                <a href="mailto:info@ane.ci" className="flex items-center gap-3 text-primary-foreground/70 hover:text-copper transition-colors">
                  <Mail className="w-5 h-5 text-copper" />
                  info@ane.ci
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} ANE SARL. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
            <a href="#" className="hover:text-copper transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-copper transition-colors">
              Politique de confidentialité
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-copper rounded-lg flex items-center justify-center hover:brightness-110 transition-all"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-5 h-5 text-accent-foreground" />
          </button>
        </div>
      </div>
    </footer>
  );
}
