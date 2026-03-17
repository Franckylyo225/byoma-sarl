import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Save, Upload, X, Star, GripVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';
import { logActivity } from '@/hooks/useActivityLogger';

type ProjectImage = Tables<'project_images'>;

const categories = [
  'Topographie',
  'Aménagement foncier',
  'Aménagement forestier',
  'Géomatique',
  'BTP',
  'Informatique',
];

export default function ProjectEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isNew = id === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    client: '',
    completed_at: '',
    link: '',
    published: false,
  });

  useEffect(() => {
    if (!isNew && id) {
      fetchProject();
    }
  }, [id, isNew]);

  const fetchProject = async () => {
    const [projectRes, imagesRes] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('project_images').select('*').eq('project_id', id).order('display_order'),
    ]);

    if (projectRes.error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Projet introuvable',
      });
      navigate('/admin/projects');
      return;
    }

    setFormData({
      title: projectRes.data.title,
      description: projectRes.data.description || '',
      category: projectRes.data.category || '',
      location: projectRes.data.location || '',
      client: projectRes.data.client || '',
      completed_at: projectRes.data.completed_at || '',
      link: (projectRes.data as any).link || '',
      published: projectRes.data.published || false,
    });

    setImages(imagesRes.data || []);
    setIsLoading(false);
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || isNew) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 5 * 1024 * 1024) continue;

        const fileExt = file.name.split('.').pop();
        const fileName = `projects/${id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);

        await supabase.from('project_images').insert({
          project_id: id,
          image_url: publicUrl,
          display_order: images.length,
          is_cover: images.length === 0,
        });
      }

      const { data: newImages } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', id)
        .order('display_order');

      setImages(newImages || []);
      toast({ title: 'Succès', description: 'Images téléchargées' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Erreur lors du téléchargement',
      });
    } finally {
      setIsUploading(false);
    }
  }, [id, images.length, isNew, toast]);

  const setCoverImage = async (imageId: string) => {
    await supabase
      .from('project_images')
      .update({ is_cover: false })
      .eq('project_id', id);

    await supabase
      .from('project_images')
      .update({ is_cover: true })
      .eq('id', imageId);

    setImages(images.map(img => ({
      ...img,
      is_cover: img.id === imageId,
    })));

    toast({ title: 'Image de couverture mise à jour' });
  };

  const deleteImage = async (imageId: string) => {
    const { error } = await supabase.from('project_images').delete().eq('id', imageId);
    
    if (error) {
      console.error('Delete error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer l\'image. Vérifiez vos permissions.',
      });
      return;
    }
    
    setImages(images.filter(img => img.id !== imageId));
    toast({ title: 'Image supprimée' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le titre est obligatoire',
      });
      return;
    }

    setIsSaving(true);

    try {
      const projectData = {
        ...formData,
        completed_at: formData.completed_at || null,
        link: formData.link || null,
      };

      if (isNew) {
        const { data, error } = await supabase.from('projects').insert({
          ...projectData,
          author_id: user?.id,
        }).select().single();

        if (error) throw error;

        if (user) {
          await logActivity({
            userId: user.id,
            action: 'project_created',
            details: { projectId: data.id, title: formData.title },
          });
        }

        toast({
          title: 'Succès',
          description: 'Projet créé. Vous pouvez maintenant ajouter des images.',
        });
        navigate(`/admin/projects/${data.id}`);
      } else {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);

        if (error) throw error;

        if (user) {
          await logActivity({
            userId: user.id,
            action: 'project_updated',
            details: { projectId: id, title: formData.title },
          });
        }

        toast({
          title: 'Succès',
          description: 'Projet mis à jour',
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder le projet',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/projects')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isNew ? 'Nouveau projet' : 'Modifier le projet'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nom du projet"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ville, Région"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="Nom du client"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="completed_at">Date de réalisation</Label>
                    <Input
                      id="completed_at"
                      type="date"
                      value={formData.completed_at}
                      onChange={(e) => setFormData({ ...formData, completed_at: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Lien du projet</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description détaillée du projet..."
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            {!isNew && (
              <Card>
                <CardHeader>
                  <CardTitle>Galerie d'images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group aspect-video">
                        <img
                          src={image.image_url}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {image.is_cover && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                            Couverture
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!image.is_cover && (
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8"
                              onClick={() => setCoverImage(image.id)}
                              title="Définir comme couverture"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={() => deleteImage(image.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Ajouter</span>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Publié</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>

            {isNew && (
              <p className="text-sm text-muted-foreground text-center">
                Enregistrez le projet pour pouvoir ajouter des images.
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
