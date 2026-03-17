import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { logActivity } from '@/hooks/useActivityLogger';

interface SlideForm {
  badge: string;
  headline: string;
  highlight: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  display_order: number;
  is_active: boolean;
}

const defaultForm: SlideForm = {
  badge: '',
  headline: '',
  highlight: '',
  description: '',
  image_url: '',
  button_text: 'Découvrir nos services',
  button_link: '#services',
  display_order: 0,
  is_active: true,
};

export default function SlideEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === 'new';

  const [form, setForm] = useState<SlideForm>(defaultForm);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      fetchSlide(id);
    }
  }, [id, isNew]);

  const fetchSlide = async (slideId: string) => {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('id', slideId)
      .single();

    if (error || !data) {
      toast({
        title: 'Erreur',
        description: 'Slide introuvable',
        variant: 'destructive',
      });
      navigate('/admin/slides');
      return;
    }

    setForm({
      badge: data.badge || '',
      headline: data.headline,
      highlight: data.highlight || '',
      description: data.description || '',
      image_url: data.image_url || '',
      button_text: data.button_text || 'Découvrir nos services',
      button_link: data.button_link || '#services',
      display_order: data.display_order || 0,
      is_active: data.is_active ?? true,
    });
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.headline.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre principal est obligatoire',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    const payload = {
      badge: form.badge || null,
      headline: form.headline,
      highlight: form.highlight || null,
      description: form.description || null,
      image_url: form.image_url || null,
      button_text: form.button_text || null,
      button_link: form.button_link || null,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    let error;
    let slideId = id;

    if (isNew) {
      const result = await supabase.from('hero_slides').insert(payload).select().single();
      error = result.error;
      if (result.data) slideId = result.data.id;
    } else {
      const result = await supabase
        .from('hero_slides')
        .update(payload)
        .eq('id', id);
      error = result.error;
    }

    setIsSaving(false);

    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await logActivity({
          userId: user.id,
          action: isNew ? 'slide_created' : 'slide_updated',
          details: { slideId, headline: form.headline },
        });
      }
      toast({
        title: 'Succès',
        description: isNew ? 'Slide créée' : 'Slide mise à jour',
      });
      navigate('/admin/slides');
    }
  };

  const handleChange = (field: keyof SlideForm, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/slides')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isNew ? 'Nouvelle slide' : 'Modifier la slide'}
          </h1>
          <p className="text-muted-foreground">
            {isNew ? 'Créez une nouvelle slide pour le carrousel' : 'Modifiez les informations de la slide'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contenu textuel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="badge">Badge (label en haut)</Label>
              <Input
                id="badge"
                value={form.badge}
                onChange={(e) => handleChange('badge', e.target.value)}
                placeholder="Ex: Notre vision"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Titre principal *</Label>
              <Input
                id="headline"
                value={form.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                placeholder="Ex: Aménager aujourd'hui,"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlight">Texte mis en avant (couleur accent)</Label>
              <Input
                id="highlight"
                value={form.highlight}
                onChange={(e) => handleChange('highlight', e.target.value)}
                placeholder="Ex: préserver demain"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description détaillée de la slide..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image de fond</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => handleChange('image_url', url)}
                bucket="media"
                folder="hero"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bouton d'action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="button_text">Texte du bouton</Label>
                <Input
                  id="button_text"
                  value={form.button_text}
                  onChange={(e) => handleChange('button_text', e.target.value)}
                  placeholder="Découvrir nos services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_link">Lien du bouton</Label>
                <Input
                  id="button_link"
                  value={form.button_link}
                  onChange={(e) => handleChange('button_link', e.target.value)}
                  placeholder="#services"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_order">Ordre d'affichage</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Slide active</Label>
                  <p className="text-sm text-muted-foreground">
                    Les slides inactives ne seront pas affichées
                  </p>
                </div>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) => handleChange('is_active', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/slides')}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isNew ? 'Créer la slide' : 'Enregistrer'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
