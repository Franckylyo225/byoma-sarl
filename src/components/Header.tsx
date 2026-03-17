import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MapPin, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/GlobalSearch";
import logoByoma from "@/assets/logo-byoma.png";

const services = [
  { name: "Négoce", href: "/services/negoce" },
  { name: "Distribution pétrolière et gazière", href: "/services/distribution-petroliere" },
  { name: "Promotion et gestion immobilière", href: "/services/immobilier" },
];

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Services", href: "#", hasDropdown: true },
  { name: "Projets", href: "/projets" },
  { name: "À propos", href: "/a-propos" },
  { name: "Actualités", href: "/actualites" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isServicesActive = location.pathname.startsWith("/services");

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-primary text-primary-foreground py-2">
        <div className="container-custom flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+2252722251544" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone size={14} />
              <span>27 22 25 15 44</span>
            </a>
            <a href="mailto:info@byoma.ci" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail size={14} />
              <span>info@byoma.ci</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>Cocody plateau Dokui, SOPIM, Abidjan</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-card/95 backdrop-blur-md shadow-premium py-3"
            : "bg-transparent py-4"
        )}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span className="font-display text-xl md:text-2xl font-bold text-foreground transition-transform group-hover:scale-105">
                BYOMA <span className="text-primary">SARL</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                item.hasDropdown ? (
                  <div 
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setIsServicesHovered(true)}
                    onMouseLeave={() => setIsServicesHovered(false)}
                  >
                    <button
                      className={cn(
                        "font-medium transition-colors relative group flex items-center gap-1 py-2",
                        isServicesActive
                          ? "text-primary"
                          : "text-foreground/80 hover:text-primary"
                      )}
                    >
                      {item.name}
                      <ChevronDown size={16} className={cn(
                        "transition-transform duration-200",
                        isServicesHovered && "rotate-180"
                      )} />
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-0.5 bg-copper transition-all duration-300",
                        isServicesActive || isServicesHovered ? "w-full" : "w-0"
                      )} />
                    </button>
                    
                    {/* Hover Dropdown */}
                    <div className={cn(
                      "absolute top-full left-0 pt-2 transition-all duration-200",
                      isServicesHovered 
                        ? "opacity-100 visible translate-y-0" 
                        : "opacity-0 invisible -translate-y-2"
                    )}>
                      <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-56">
                        {services.map((service) => (
                          <Link
                            key={service.href}
                            to={service.href}
                            className="block px-4 py-2.5 text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "font-medium transition-colors relative group",
                      location.pathname === item.href
                        ? "text-primary"
                        : "text-foreground/80 hover:text-primary"
                    )}
                  >
                    {item.name}
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-copper transition-all duration-300",
                      location.pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </Link>
                )
              ))}
            </div>

            {/* Search & CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Rechercher</span>
                <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-background rounded border border-border">
                  ⌘K
                </kbd>
              </button>
              <Link to="/contact">
                <Button variant="premium" size="lg">
                  Nous contacter
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "lg:hidden overflow-hidden transition-all duration-300",
              isMobileMenuOpen ? "max-h-[500px] mt-4" : "max-h-0"
            )}
          >
            <div className="flex flex-col gap-2 py-4 border-t border-border">
              {navigation.map((item) => (
                item.hasDropdown ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className={cn(
                        "font-medium transition-colors py-2 w-full text-left flex items-center justify-between",
                        isServicesActive
                          ? "text-primary"
                          : "text-foreground/80 hover:text-primary"
                      )}
                    >
                      {item.name}
                      <ChevronDown size={16} className={cn(
                        "transition-transform",
                        isMobileServicesOpen && "rotate-180"
                      )} />
                    </button>
                    <div className={cn(
                      "overflow-hidden transition-all duration-300 pl-4",
                      isMobileServicesOpen ? "max-h-96" : "max-h-0"
                    )}>
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          to={service.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-2 text-foreground/70 hover:text-primary"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "font-medium transition-colors py-2",
                      location.pathname === item.href
                        ? "text-primary"
                        : "text-foreground/80 hover:text-primary"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex items-center gap-2 py-2 text-foreground/80 hover:text-primary"
              >
                <Search className="w-4 h-4" />
                Rechercher
              </button>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="premium" className="mt-2 w-full">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}