import { MapPin, Phone, Mail } from "lucide-react";

export function TrustBadges() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/10">
          <div className="flex items-center gap-4 py-6 md:py-8 md:pr-8">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/50 mb-1">Notre adresse</div>
              <div className="text-sm font-medium">Cocody plateau Dokui, SOPIM, Abidjan</div>
            </div>
          </div>
          <div className="flex items-center gap-4 py-6 md:py-8 md:px-8">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/50 mb-1">Appelez-nous</div>
              <a href="tel:+2252722251544" className="text-sm font-medium hover:text-accent transition-colors">
                27 22 25 15 44
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 py-6 md:py-8 md:pl-8">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/50 mb-1">Écrivez-nous</div>
              <a href="mailto:info@byoma.ci" className="text-sm font-medium hover:text-accent transition-colors">
                info@byoma.ci
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
