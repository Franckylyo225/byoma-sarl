import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ChevronDown, Search } from "lucide-react";
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isServicesActive = location.pathname.startsWith("/services");

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-card/95 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img
                src={logoByoma}
                alt="BYOMA SARL"
                className={cn(
                  "h-10 md:h-12 w-auto transition-all",
                  !isScrolled && "brightness-0 invert"
                )}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) =>
                item.hasDropdown ? (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setIsServicesHovered(true)}
                    onMouseLeave={() => setIsServicesHovered(false)}
                  >
                    <button
                      className={cn(
                        "font-medium text-sm tracking-wide uppercase transition-colors flex items-center gap-1 py-2",
                        isScrolled
                          ? isServicesActive ? "text-accent" : "text-foreground/80 hover:text-accent"
                          : isServicesActive ? "text-accent" : "text-white/80 hover:text-accent"
                      )}
                    >
                      {item.name}
                      <ChevronDown size={14} className={cn("transition-transform", isServicesHovered && "rotate-180")} />
                    </button>

                    <div className={cn(
                      "absolute top-full left-0 pt-3 transition-all duration-200",
                      isServicesHovered ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                    )}>
                      <div className="bg-card border border-border rounded-lg shadow-lg py-2 min-w-60">
                        {services.map((service) => (
                          <Link
                            key={service.href}
                            to={service.href}
                            className="block px-5 py-3 text-sm text-foreground/80 hover:text-accent hover:bg-muted transition-colors"
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
                      "font-medium text-sm tracking-wide uppercase transition-colors",
                      isScrolled
                        ? location.pathname === item.href ? "text-accent" : "text-foreground/80 hover:text-accent"
                        : location.pathname === item.href ? "text-accent" : "text-white/80 hover:text-accent"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+2252722251544"
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isScrolled ? "text-foreground/80 hover:text-accent" : "text-white/80 hover:text-accent"
                )}
              >
                <Phone size={16} />
                27 22 25 15 44
              </a>
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "p-2 transition-colors rounded-lg",
                  isScrolled ? "text-foreground/60 hover:text-accent" : "text-white/60 hover:text-accent"
                )}
              >
                <Search className="w-5 h-5" />
              </button>
              <Link to="/contact">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-6">
                  Nous contacter
                </Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn("lg:hidden p-2", isScrolled ? "text-foreground" : "text-white")}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* Mobile Nav */}
          <div className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-[500px] mt-4" : "max-h-0"
          )}>
            <div className="flex flex-col gap-1 py-4 border-t border-border bg-card rounded-xl p-4 mt-2">
              {navigation.map((item) =>
                item.hasDropdown ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className="font-medium text-sm uppercase tracking-wide py-3 w-full text-left flex items-center justify-between text-foreground/80"
                    >
                      {item.name}
                      <ChevronDown size={14} className={cn("transition-transform", isMobileServicesOpen && "rotate-180")} />
                    </button>
                    <div className={cn("overflow-hidden transition-all duration-300 pl-4", isMobileServicesOpen ? "max-h-96" : "max-h-0")}>
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          to={service.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-2 text-sm text-foreground/60 hover:text-accent"
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
                    className="font-medium text-sm uppercase tracking-wide py-3 text-foreground/80 hover:text-accent"
                  >
                    {item.name}
                  </Link>
                )
              )}
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2 w-full font-semibold">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
