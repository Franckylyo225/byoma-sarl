import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, FileText, FolderOpen, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Article = Tables<'articles'>;
type Project = Tables<'projects'>;

interface SearchResult {
  id: string;
  type: 'article' | 'project';
  title: string;
  excerpt: string;
  date: string;
  category?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMM yyyy", { locale: fr });
  };

  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Search articles
      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      // Search projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,client.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      const searchResults: SearchResult[] = [];

      // Map articles to search results
      if (articles) {
        articles.forEach((article: Article) => {
          searchResults.push({
            id: article.id,
            type: 'article',
            title: article.title,
            excerpt: article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
            date: formatDate(article.created_at),
          });
        });
      }

      // Map projects to search results
      if (projects) {
        projects.forEach((project: Project) => {
          searchResults.push({
            id: project.id,
            type: 'project',
            title: project.title,
            excerpt: project.description?.substring(0, 100) + '...' || '',
            date: formatDate(project.created_at),
            category: project.category || undefined,
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // This will be handled by the parent component
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleResultClick = (result: SearchResult) => {
    const path = result.type === 'article' 
      ? `/actualites/${result.id}` 
      : `/projets/${result.id}`;
    navigate(path);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Rechercher des projets ou articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground bg-muted rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : query.length < 2 ? (
            <div className="py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Tapez au moins 2 caractères pour rechercher
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Recherchez parmi nos projets et actualités
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Aucun résultat pour "{query}"
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Essayez avec d'autres termes
              </p>
            </div>
          ) : (
            <div className="py-2">
              {/* Group by type */}
              {results.filter(r => r.type === 'project').length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Projets
                  </div>
                  {results.filter(r => r.type === 'project').map((result) => (
                    <button
                      key={`project-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted transition-colors text-left"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground line-clamp-1">
                          {result.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          {result.excerpt}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{result.date}</span>
                          {result.category && (
                            <span className="text-xs px-2 py-0.5 bg-copper/20 text-copper rounded-full">
                              {result.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.filter(r => r.type === 'article').length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Articles
                  </div>
                  {results.filter(r => r.type === 'article').map((result) => (
                    <button
                      key={`article-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted transition-colors text-left"
                    >
                      <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground line-clamp-1">
                          {result.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          {result.excerpt}
                        </div>
                        <span className="text-xs text-muted-foreground">{result.date}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd>
              Navigation
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↵</kbd>
              Ouvrir
            </span>
          </div>
          <span>
            {results.length > 0 && `${results.length} résultat${results.length > 1 ? 's' : ''}`}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}