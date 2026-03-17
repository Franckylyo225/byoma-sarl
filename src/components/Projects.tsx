import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, MapPin, Loader2 } from "lucide-react";
import { useScrollReveal, useScrollRevealMultiple } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";

type Project = Tables<'projects'> & {
  cover_image?: string;
};

const categories = ["Tous", "Aménagement forestier", "Aménagement foncier", "BTP"];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const headerReveal = useScrollReveal({ threshold: 0.2 });
  const ctaReveal = useScrollReveal({ threshold: 0.3 });
  
  const filteredProjects = activeCategory === "Tous" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);
  
  const { setRef, visibleItems } = useScrollRevealMultiple(filteredProjects.length, { threshold: 0.15 });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          setIsLoading(false);
          return;
        }

        if (!projectsData || projectsData.length === 0) {
          setProjects([]);
          setIsLoading(false);
          return;
        }

        // Fetch cover images for each project
        const projectsWithImages = await Promise.all(
          projectsData.map(async (project) => {
            const { data: imageData } = await supabase
              .from('project_images')
              .select('image_url')
              .eq('project_id', project.id)
              .eq('is_cover', true)
              .maybeSingle();

            return {
              ...project,
              cover_image: imageData?.image_url || undefined,
            };
          })
        );

        setProjects(projectsWithImages);
      } catch (err) {
        console.error('Unexpected error fetching projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projets" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div 
          ref={headerReveal.ref}
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 scroll-reveal ${headerReveal.isVisible ? "visible" : ""}`}
        >
          <div>
            <span className="inline-block text-copper font-semibold text-sm uppercase tracking-widest mb-4">
              Portfolio
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Nos réalisations <span className="text-primary">phares</span>
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun projet disponible pour le moment.</p>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                ref={setRef(index)}
                className={`group bg-card rounded-2xl overflow-hidden shadow-premium card-hover scroll-reveal ${
                  visibleItems[index] ? "visible" : ""
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Pas d'image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  {project.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-copper text-accent-foreground text-xs font-semibold rounded-full">
                        {project.category}
                      </span>
                    </div>
                  )}
                  {project.location && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-primary-foreground/90 text-sm">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Client info */}
                  {project.client && (
                    <div className="mb-4 pb-4 border-b border-border">
                      <div className="text-xs text-muted-foreground">Client</div>
                      <div className="text-sm font-medium text-foreground">{project.client}</div>
                    </div>
                  )}

                  {/* Links */}
                   <div className="flex items-center justify-between pt-2">
                     <Link 
                       to={`/projets/${project.id}`}
                       className="inline-flex items-center gap-2 text-copper font-medium hover:gap-3 transition-all"
                     >
                       Voir le projet
                       <ExternalLink className="w-4 h-4" />
                     </Link>
                     
                     {(project as any).link && (
                       <a 
                         href={(project as any).link} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full hover:bg-emerald-700 transition-colors"
                       >
                         <ExternalLink className="w-3.5 h-3.5" />
                         Accéder au site
                       </a>
                     )}
                   </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div 
          ref={ctaReveal.ref}
          className={`text-center mt-12 scroll-reveal-scale ${ctaReveal.isVisible ? "visible" : ""}`}
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/projets">
              Voir tous nos projets
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}