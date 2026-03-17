import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";

type Project = Tables<'projects'> & {
  cover_image?: string;
};

const categories = ["Tous", "Aménagement forestier", "Aménagement foncier", "BTP", "Topographie", "Géomatique"];
const PROJECTS_PER_PAGE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (projectsError || !projectsData) {
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
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const filteredProjects = activeCategory === "Tous" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-primary-foreground/80 font-semibold text-sm uppercase tracking-widest mb-4">
              Portfolio
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Nos réalisations phares
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Découvrez nos projets d'aménagement foncier et forestier à travers la Côte d'Ivoire.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!isLoading && filteredProjects.length > 0 && (
            <div className="text-center text-muted-foreground mb-8">
              {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Aucun projet disponible pour le moment.</p>
            </div>
          ) : (
            <>
              {/* Projects Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group bg-card rounded-2xl overflow-hidden shadow-premium card-hover"
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

                       {/* Link */}
                       <div className="flex items-center justify-between pt-2">
                         <Link 
                           to={`/projets/${project.id}`}
                           className="inline-flex items-center gap-2 text-copper font-medium hover:gap-3 transition-all"
                         >
                           Voir le projet
                           <ExternalLink className="w-4 h-4" />
                         </Link>
                         
                         {project.link && (
                           <a 
                             href={project.link} 
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page as number)}
                          className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Vous avez un projet en tête ?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de vos besoins et découvrir comment nous pouvons vous accompagner.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/contact">
              Contactez-nous
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}