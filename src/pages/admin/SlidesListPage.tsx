import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { logActivity } from '@/hooks/useActivityLogger';

interface HeroSlide {
  id: string;
  badge: string | null;
  headline: string;
  highlight: string | null;
  description: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function SlidesListPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching slides:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les slides',
        variant: 'destructive',
      });
    } else {
      setSlides(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const toggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('hero_slides')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut',
        variant: 'destructive',
      });
    } else {
      setSlides(slides.map(s => s.id === id ? { ...s, is_active: !currentState } : s));
      toast({
        title: 'Succès',
        description: `Slide ${!currentState ? 'activée' : 'désactivée'}`,
      });
    }
  };

  const deleteSlide = async (id: string) => {
    const slideToDelete = slides.find(s => s.id === id);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la slide',
        variant: 'destructive',
      });
    } else {
      if (user && slideToDelete) {
        await logActivity({
          userId: user.id,
          action: 'slide_deleted',
          details: { slideId: id, headline: slideToDelete.headline },
        });
      }
      setSlides(slides.filter(s => s.id !== id));
      toast({
        title: 'Succès',
        description: 'Slide supprimée',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Slides Hero</h1>
          <p className="text-muted-foreground">Gérez les slides du carrousel de la page d'accueil</p>
        </div>
        <Button asChild>
          <Link to="/admin/slides/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle slide
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des slides ({slides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucune slide pour le moment.</p>
              <Button asChild className="mt-4">
                <Link to="/admin/slides/new">Créer la première slide</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Ordre</TableHead>
                  <TableHead>Aperçu</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide, index) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span>{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {slide.image_url ? (
                        <div className="relative group">
                          <img
                            src={slide.image_url}
                            alt={slide.headline}
                            className="w-24 h-14 object-cover rounded-md border border-border shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                            <a
                              href={slide.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-xs hover:underline"
                            >
                              Agrandir
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-14 bg-muted rounded-md border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground">
                          Pas d'image
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{slide.headline}</p>
                        {slide.highlight && (
                          <p className="text-sm text-primary">{slide.highlight}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {slide.badge && <Badge variant="secondary">{slide.badge}</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={slide.is_active}
                          onCheckedChange={() => toggleActive(slide.id, slide.is_active)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {slide.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/slides/${slide.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette slide ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. La slide sera définitivement supprimée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSlide(slide.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
