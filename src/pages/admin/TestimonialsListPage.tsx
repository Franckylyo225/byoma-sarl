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
  Star,
  MoreHorizontal,
  Quote
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

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string | null;
  organization: string | null;
  rating: number | null;
  image_url: string | null;
  published: boolean | null;
  archived: boolean | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export default function TestimonialsListPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const fetchTestimonials = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les témoignages',
      });
    } else {
      setTestimonials(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const togglePublish = async (testimonial: Testimonial) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ published: !testimonial.published })
      .eq('id', testimonial.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier le statut',
      });
    } else {
      toast({
        title: 'Succès',
        description: testimonial.published ? 'Témoignage dépublié' : 'Témoignage publié',
      });
      fetchTestimonials();
    }
  };

  const toggleArchive = async (testimonial: Testimonial) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ archived: !testimonial.archived })
      .eq('id', testimonial.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier le statut d\'archivage',
      });
    } else {
      toast({
        title: 'Succès',
        description: testimonial.archived ? 'Témoignage restauré' : 'Témoignage archivé',
      });
      fetchTestimonials();
    }
  };

  const handleBulkArchive = async (archive: boolean) => {
    if (selectedIds.length === 0) return;

    const { error } = await supabase
      .from('testimonials')
      .update({ archived: archive })
      .in('id', selectedIds);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier les témoignages',
      });
    } else {
      toast({
        title: 'Succès',
        description: `${selectedIds.length} témoignage(s) ${archive ? 'archivé(s)' : 'restauré(s)'}`,
      });
      setSelectedIds([]);
      fetchTestimonials();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const testimonialToDelete = testimonials.find(t => t.id === deleteId);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer le témoignage',
      });
    } else {
      if (user && testimonialToDelete) {
        await logActivity({
          userId: user.id,
          action: 'article_deleted',
          details: { testimonialId: deleteId, author: testimonialToDelete.author },
        });
      }
      toast({
        title: 'Succès',
        description: 'Témoignage supprimé définitivement',
      });
      fetchTestimonials();
    }
    setDeleteId(null);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .in('id', selectedIds);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer les témoignages',
      });
    } else {
      if (user) {
        await logActivity({
          userId: user.id,
          action: 'article_deleted',
          details: { count: selectedIds.length, bulk: true, type: 'testimonials' },
        });
      }
      toast({
        title: 'Succès',
        description: `${selectedIds.length} témoignage(s) supprimé(s)`,
      });
      setSelectedIds([]);
      fetchTestimonials();
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTestimonials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTestimonials.map(t => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getFilteredByTab = () => {
    switch (activeTab) {
      case 'published':
        return testimonials.filter(t => t.published && !t.archived);
      case 'draft':
        return testimonials.filter(t => !t.published && !t.archived);
      case 'archived':
        return testimonials.filter(t => t.archived);
      default:
        return testimonials.filter(t => !t.archived);
    }
  };

  const filteredTestimonials = getFilteredByTab().filter(testimonial =>
    testimonial.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (testimonial.organization?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const counts = {
    all: testimonials.filter(t => !t.archived).length,
    published: testimonials.filter(t => t.published && !t.archived).length,
    draft: testimonials.filter(t => !t.published && !t.archived).length,
    archived: testimonials.filter(t => t.archived).length,
  };

  const getStatusBadge = (testimonial: Testimonial) => {
    if (testimonial.archived) {
      return <Badge variant="outline" className="text-muted-foreground">Archivé</Badge>;
    }
    if (testimonial.published) {
      return <Badge className="bg-primary hover:bg-primary/90">Publié</Badge>;
    }
    return <Badge variant="secondary">Brouillon</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Témoignages</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les avis et témoignages clients
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/testimonials/new">
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
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun témoignage trouvé
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-[40px_60px_1fr_150px_100px_100px] gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground border-b">
                <div className="flex items-center">
                  <Checkbox 
                    checked={selectedIds.length === filteredTestimonials.length && filteredTestimonials.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
                <div>Photo</div>
                <div>Auteur & Témoignage</div>
                <div>Organisation</div>
                <div>Statut</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {filteredTestimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="grid grid-cols-1 md:grid-cols-[40px_60px_1fr_150px_100px_100px] gap-2 md:gap-4 p-3 hover:bg-muted/30 transition-colors items-center"
                  >
                    {/* Checkbox */}
                    <div className="hidden md:flex items-center">
                      <Checkbox 
                        checked={selectedIds.includes(testimonial.id)}
                        onCheckedChange={() => toggleSelect(testimonial.id)}
                      />
                    </div>

                    {/* Image */}
                    <div>
                      {testimonial.image_url ? (
                        <div className="relative group">
                          <img
                            src={testimonial.image_url}
                            alt={testimonial.author}
                            className="w-12 h-12 object-cover rounded-full border border-border shadow-sm"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <Quote className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Author & content */}
                    <div className="min-w-0">
                      <Link 
                        to={`/admin/testimonials/${testimonial.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {testimonial.author}
                        {testimonial.role && (
                          <span className="text-muted-foreground font-normal"> — {testimonial.role}</span>
                        )}
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        "{testimonial.content}"
                      </p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-copper text-copper" />
                        ))}
                      </div>
                    </div>

                    {/* Organization */}
                    <div className="text-sm text-muted-foreground">
                      {testimonial.organization || '-'}
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      {getStatusBadge(testimonial)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to={`/admin/testimonials/${testimonial.id}`}>
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
                          <DropdownMenuItem onClick={() => togglePublish(testimonial)}>
                            {testimonial.published ? (
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
                          <DropdownMenuItem onClick={() => toggleArchive(testimonial)}>
                            {testimonial.archived ? (
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
                                onClick={() => setDeleteId(testimonial.id)}
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
              Cette action est irréversible. Le témoignage sera définitivement supprimé de la base de données.
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
