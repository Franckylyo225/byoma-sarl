import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, MapPin, ArrowLeft, User, Loader2, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Project = Tables<'projects'>;
type ProjectImage = Tables<'project_images'>;

type ProjectWithCover = Project & {
  cover_image?: string;
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [similarProjects, setSimilarProjects] = useState<ProjectWithCover[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("Projet non trouvé");
        setIsLoading(false);
        return;
      }

      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .maybeSingle();

      if (projectError) {
        setError("Erreur lors du chargement du projet");
        setIsLoading(false);
        return;
      }

      if (!projectData) {
        setError("Projet non trouvé");
        setIsLoading(false);
        return;
      }

      setProject(projectData);

      // Fetch project images
      const { data: imagesData } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', id)
        .order('display_order', { ascending: true });

      if (imagesData) {
        setImages(imagesData);
      }

      // Fetch similar projects (same category or recent)
      let similarQuery = supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .neq('id', id)
        .limit(3);

      if (projectData.category) {
        similarQuery = similarQuery.eq('category', projectData.category);
      }

      const { data: similarData } = await similarQuery.order('created_at', { ascending: false });

      // If not enough similar projects, fetch recent ones
      let finalSimilar = similarData || [];
      if (finalSimilar.length < 3) {
        const { data: recentData } = await supabase
          .from('projects')
          .select('*')
          .eq('published', true)
          .neq('id', id)
          .order('created_at', { ascending: false })
          .limit(3 - finalSimilar.length);

        if (recentData) {
          const existingIds = new Set(finalSimilar.map(p => p.id));
          const additionalProjects = recentData.filter(p => !existingIds.has(p.id));
          finalSimilar = [...finalSimilar, ...additionalProjects].slice(0, 3);
        }
      }

      // Fetch cover images for similar projects
      const similarWithImages = await Promise.all(
        finalSimilar.map(async (proj) => {
          const { data: imageData } = await supabase
            .from('project_images')
            .select('image_url')
            .eq('project_id', proj.id)
            .eq('is_cover', true)
            .maybeSingle();

          return {
            ...proj,
            cover_image: imageData?.image_url || undefined,
          };
        })
      );

      setSimilarProjects(similarWithImages);
      setIsLoading(false);
    };

    fetchProject();
  }, [id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM yyyy", { locale: fr });
  };

  const coverImage = images.find(img => img.is_cover) || images[0];
  const galleryImages = images.filter(img => !img.is_cover || images.length === 1);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            {error || "Projet non trouvé"}
          </h1>
          <p className="text-muted-foreground mb-8">
            Le projet que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
          <Button asChild>
            <Link to="/projets">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux projets
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Cover Image */}
      <section className="relative">
        {coverImage ? (
          <div className="relative h-[60vh] min-h-[500px]">
            <img
              src={coverImage.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            {/* Back link at top */}
            <div className="absolute top-24 left-0 right-0">
              <div className="container-custom">
                <Link 
                  to="/projets" 
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux projets
                </Link>
              </div>
            </div>
            {/* Title at bottom */}
            <div className="absolute inset-0 flex items-end">
              <div className="container-custom pb-12">
                {project.category && (
                  <span className="inline-block px-4 py-1.5 bg-copper text-accent-foreground text-sm font-semibold rounded-full mb-4">
                    {project.category}
                  </span>
                )}
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl">
                  {project.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary text-primary-foreground py-20">
            <div className="container-custom">
              <Link 
                to="/projets" 
                className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux projets
              </Link>
              <div>
                {project.category && (
                  <span className="inline-block px-4 py-1.5 bg-copper text-accent-foreground text-sm font-semibold rounded-full mb-4">
                    {project.category}
                  </span>
                )}
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl">
                  {project.title}
                </h1>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Project Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              {project.description && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                    Description du projet
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {project.description}
                  </p>
                  {(project as any).link && (
                    <Button className="mt-4" asChild>
                      <a href={(project as any).link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Accéder au site du projet
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {/* Image Gallery */}
              {galleryImages.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Galerie photos
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(images.indexOf(image))}
                      >
                        <img
                          src={image.image_url}
                          alt={image.caption || `Image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                            Voir
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 border border-border sticky top-24">
                <h3 className="font-display text-xl font-bold text-foreground mb-6">
                  Informations
                </h3>
                
                <div className="space-y-4">
                  {project.client && (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Client</div>
                        <div className="font-medium text-foreground">{project.client}</div>
                      </div>
                    </div>
                  )}

                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Localisation</div>
                        <div className="font-medium text-foreground">{project.location}</div>
                      </div>
                    </div>
                  )}

                  {project.completed_at && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Date de réalisation</div>
                        <div className="font-medium text-foreground capitalize">
                          {formatDate(project.completed_at)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Vous avez un projet similaire ?
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/contact">
                      Contactez-nous
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Projects */}
      {similarProjects.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              Projets similaires
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProjects.map((proj) => (
                <Link
                  key={proj.id}
                  to={`/projets/${proj.id}`}
                  className="group bg-card rounded-2xl overflow-hidden shadow-premium card-hover"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {proj.cover_image ? (
                      <img
                        src={proj.cover_image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Pas d'image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    {proj.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-copper text-accent-foreground text-xs font-semibold rounded-full">
                          {proj.category}
                        </span>
                      </div>
                    )}
                    {proj.location && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-primary-foreground/90 text-sm">
                        <MapPin className="w-4 h-4" />
                        {proj.location}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {proj.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Image */}
          <div 
            className="max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImageIndex].image_url}
              alt={images[selectedImageIndex].caption || "Image du projet"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            {images[selectedImageIndex].caption && (
              <p className="text-center text-white/80 mt-4">
                {images[selectedImageIndex].caption}
              </p>
            )}
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}