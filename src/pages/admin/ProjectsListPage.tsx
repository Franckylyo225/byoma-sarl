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
  MapPin,
  Archive,
  ArchiveRestore,
  Calendar,
  MoreHorizontal,
  FolderOpen
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

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  client: string | null;
  published: boolean | null;
  archived: boolean | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string | null;
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les projets',
      });
    } else {
      setProjects((data as Project[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const togglePublish = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ published: !project.published })
      .eq('id', project.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier le statut',
      });
    } else {
      toast({
        title: 'Succès',
        description: project.published ? 'Projet dépublié' : 'Projet publié',
      });
      fetchProjects();
    }
  };

  const toggleArchive = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ archived: !project.archived })
      .eq('id', project.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier le statut d\'archivage',
      });
    } else {
      toast({
        title: 'Succès',
        description: project.archived ? 'Projet restauré' : 'Projet archivé',
      });
      fetchProjects();
    }
  };

  const handleBulkArchive = async (archive: boolean) => {
    if (selectedIds.length === 0) return;

    const { error } = await supabase
      .from('projects')
      .update({ archived: archive })
      .in('id', selectedIds);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de modifier les projets',
      });
    } else {
      toast({
        title: 'Succès',
        description: `${selectedIds.length} projet(s) ${archive ? 'archivé(s)' : 'restauré(s)'}`,
      });
      setSelectedIds([]);
      fetchProjects();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const projectToDelete = projects.find(p => p.id === deleteId);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer le projet',
      });
    } else {
      if (user && projectToDelete) {
        await logActivity({
          userId: user.id,
          action: 'project_deleted',
          details: { projectId: deleteId, title: projectToDelete.title },
        });
      }
      toast({
        title: 'Succès',
        description: 'Projet supprimé définitivement',
      });
      fetchProjects();
    }
    setDeleteId(null);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('projects')
      .delete()
      .in('id', selectedIds);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer les projets',
      });
    } else {
      if (user) {
        await logActivity({
          userId: user.id,
          action: 'project_deleted',
          details: { count: selectedIds.length, bulk: true },
        });
      }
      toast({
        title: 'Succès',
        description: `${selectedIds.length} projet(s) supprimé(s)`,
      });
      setSelectedIds([]);
      fetchProjects();
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Filter projects based on tab and search
  const getFilteredByTab = () => {
    switch (activeTab) {
      case 'published':
        return projects.filter(p => p.published && !p.archived);
      case 'draft':
        return projects.filter(p => !p.published && !p.archived);
      case 'archived':
        return projects.filter(p => p.archived);
      default:
        return projects.filter(p => !p.archived);
    }
  };

  const filteredProjects = getFilteredByTab().filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const counts = {
    all: projects.filter(p => !p.archived).length,
    published: projects.filter(p => p.published && !p.archived).length,
    draft: projects.filter(p => !p.published && !p.archived).length,
    archived: projects.filter(p => p.archived).length,
  };

  const getStatusBadge = (project: Project) => {
    if (project.archived) {
      return <Badge variant="outline" className="text-muted-foreground">Archivé</Badge>;
    }
    if (project.published) {
      return <Badge className="bg-primary hover:bg-primary/90">Publié</Badge>;
    }
    return <Badge variant="secondary">Brouillon</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projets</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les projets et réalisations
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/projects/new">
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
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun projet trouvé
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-[40px_1fr_120px_120px_150px_100px] gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground border-b">
                <div className="flex items-center">
                  <Checkbox 
                    checked={selectedIds.length === filteredProjects.length && filteredProjects.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
                <div>Titre</div>
                <div>Catégorie</div>
                <div>Statut</div>
                <div>Date</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="grid grid-cols-1 md:grid-cols-[40px_1fr_120px_120px_150px_100px] gap-2 md:gap-4 p-3 hover:bg-muted/30 transition-colors items-center"
                  >
                    {/* Checkbox */}
                    <div className="hidden md:flex items-center">
                      <Checkbox 
                        checked={selectedIds.includes(project.id)}
                        onCheckedChange={() => toggleSelect(project.id)}
                      />
                    </div>

                    {/* Title & location */}
                    <div className="min-w-0">
                      <Link 
                        to={`/admin/projects/${project.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {project.title}
                      </Link>
                      {project.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {project.location}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="flex items-center">
                      {project.category ? (
                        <Badge variant="outline" className="text-xs">
                          <FolderOpen className="h-3 w-3 mr-1" />
                          {project.category}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      {getStatusBadge(project)}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(project.created_at), 'dd MMM yyyy', { locale: fr })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to={`/admin/projects/${project.id}`}>
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
                          <DropdownMenuItem onClick={() => togglePublish(project)}>
                            {project.published ? (
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
                          <DropdownMenuItem onClick={() => toggleArchive(project)}>
                            {project.archived ? (
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
                                onClick={() => setDeleteId(project.id)}
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
              Cette action est irréversible. Le projet et toutes ses images seront définitivement supprimés.
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
