import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2,
  Search,
  Archive,
  ArchiveRestore,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { logActivity } from '@/hooks/useActivityLogger';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean | null;
  archived: boolean | null;
  created_at: string;
  updated_at: string;
  author_id: string | null;
  content: string;
}

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const fetchArticles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les articles',
      });
    } else {
      setArticles((data as Article[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const togglePublish = async (article: Article) => {
    const { error } = await supabase
      .from('articles')
      .update({ published: !article.published })
      .eq('id', article.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier le statut',
      });
    } else {
      toast({
        title: 'Succès',
        description: article.published ? 'Article dépublié' : 'Article publié',
      });
      fetchArticles();
    }
  };

  const toggleArchive = async (article: Article) => {
    const { error } = await supabase
      .from('articles')
      .update({ archived: !article.archived })
      .eq('id', article.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier le statut d\'archivage',
      });
    } else {
      toast({
        title: 'Succès',
        description: article.archived ? 'Article restauré' : 'Article archivé',
      });
      fetchArticles();
    }
  };

  const handleBulkArchive = async (archive: boolean) => {
    if (selectedIds.length === 0) return;

    const { error } = await supabase
      .from('articles')
      .update({ archived: archive })
      .in('id', selectedIds);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier les articles',
      });
    } else {
      toast({
        title: 'Succès',
        description: `${selectedIds.length} article(s) ${archive ? 'archivé(s)' : 'restauré(s)'}`,
      });
      setSelectedIds([]);
      fetchArticles();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const articleToDelete = articles.find(a => a.id === deleteId);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article',
      });
    } else {
      if (user && articleToDelete) {
        await logActivity({
          userId: user.id,
          action: 'article_deleted',
          details: { articleId: deleteId, title: articleToDelete.title },
        });
      }
      toast({
        title: 'Succès',
        description: 'Article supprimé définitivement',
      });
      fetchArticles();
    }
    setDeleteId(null);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('articles')
      .delete()
      .in('id', selectedIds);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer les articles',
      });
    } else {
      if (user) {
        await logActivity({
          userId: user.id,
          action: 'article_deleted',
          details: { count: selectedIds.length, bulk: true },
        });
      }
      toast({
        title: 'Succès',
        description: `${selectedIds.length} article(s) supprimé(s)`,
      });
      setSelectedIds([]);
      fetchArticles();
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map(a => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Filter articles based on tab and search
  const getFilteredByTab = () => {
    switch (activeTab) {
      case 'published':
        return articles.filter(a => a.published && !a.archived);
      case 'draft':
        return articles.filter(a => !a.published && !a.archived);
      case 'archived':
        return articles.filter(a => a.archived);
      default:
        return articles.filter(a => !a.archived);
    }
  };

  const filteredArticles = getFilteredByTab().filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const counts = {
    all: articles.filter(a => !a.archived).length,
    published: articles.filter(a => a.published && !a.archived).length,
    draft: articles.filter(a => !a.published && !a.archived).length,
    archived: articles.filter(a => a.archived).length,
  };

  const getStatusBadge = (article: Article) => {
    if (article.archived) {
      return <Badge variant="outline" className="text-muted-foreground">Archivé</Badge>;
    }
    if (article.published) {
      return <Badge className="bg-primary hover:bg-primary/90">Publié</Badge>;
    }
    return <Badge variant="secondary">Brouillon</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les actualités et articles du site
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/articles/new">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSelectedIds([]); }}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList className="h-auto p-1">
            <TabsTrigger value="all" className="text-xs">
              Tous ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="published" className="text-xs">
              Publiés ({counts.published})
            </TabsTrigger>
            <TabsTrigger value="draft" className="text-xs">
              Brouillons ({counts.draft})
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs">
              Archivés ({counts.archived})
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mt-4">
            <span className="text-sm font-medium">
              {selectedIds.length} sélectionné(s)
            </span>
            <div className="flex-1" />
            {activeTab === 'archived' ? (
              <Button size="sm" variant="outline" onClick={() => handleBulkArchive(false)}>
                <ArchiveRestore className="h-4 w-4 mr-1" />
                Restaurer
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => handleBulkArchive(true)}>
                <Archive className="h-4 w-4 mr-1" />
                Archiver
              </Button>
            )}
            {isAdmin && (
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            )}
          </div>
        )}

        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun article trouvé
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-[40px_1fr_120px_150px_100px] gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground border-b">
                <div className="flex items-center">
                  <Checkbox 
                    checked={selectedIds.length === filteredArticles.length && filteredArticles.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
                <div>Titre</div>
                <div>Statut</div>
                <div>Date</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {filteredArticles.map((article) => (
                  <div 
                    key={article.id} 
                    className="grid grid-cols-1 md:grid-cols-[40px_1fr_120px_150px_100px] gap-2 md:gap-4 p-3 hover:bg-muted/30 transition-colors items-center"
                  >
                    {/* Checkbox */}
                    <div className="hidden md:flex items-center">
                      <Checkbox 
                        checked={selectedIds.includes(article.id)}
                        onCheckedChange={() => toggleSelect(article.id)}
                      />
                    </div>

                    {/* Title & excerpt */}
                    <div className="min-w-0">
                      <Link 
                        to={`/admin/articles/${article.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {article.title}
                      </Link>
                      {article.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {article.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      {getStatusBadge(article)}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(article.created_at), 'dd MMM yyyy', { locale: fr })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to={`/admin/articles/${article.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => togglePublish(article)}>
                            {article.published ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Dépublier
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Publier
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleArchive(article)}>
                            {article.archived ? (
                              <>
                                <ArchiveRestore className="h-4 w-4 mr-2" />
                                Restaurer
                              </>
                            ) : (
                              <>
                                <Archive className="h-4 w-4 mr-2" />
                                Archiver
                              </>
                            )}
                          </DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(article.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer définitivement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'article sera définitivement supprimé de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
