import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Article = Tables<'articles'>;

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("Article non trouvé");
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .maybeSingle();

      if (fetchError) {
        setError("Erreur lors du chargement de l'article");
      } else if (!data) {
        setError("Article non trouvé");
      } else {
        setArticle(data);
      }
      setIsLoading(false);
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  const estimateReadTime = (content: string) => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min de lecture`;
  };

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

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            {error || "Article non trouvé"}
          </h1>
          <p className="text-muted-foreground mb-8">
            L'article que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
          <Button asChild>
            <Link to="/actualites">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux actualités
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
        {article.cover_image_url ? (
          <div className="relative h-[50vh] min-h-[400px]">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute inset-0 flex items-end">
              <div className="container-custom pb-12">
                <Link 
                  to="/actualites" 
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour aux actualités
                </Link>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl">
                  {article.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary text-primary-foreground py-20">
            <div className="container-custom">
              <Link 
                to="/actualites" 
                className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux actualités
              </Link>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold max-w-4xl">
                {article.title}
              </h1>
            </div>
          </div>
        )}
      </section>

      {/* Article Content */}
      <article className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-border">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(article.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {estimateReadTime(article.content)}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                ANE Gabon
              </span>
            </div>

            {/* Article Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-medium">
                {article.excerpt}
              </p>
            )}

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t border-border">
              <Button variant="outline" asChild>
                <Link to="/actualites">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux actualités
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}