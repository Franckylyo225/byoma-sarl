import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Save, Star, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logActivity } from '@/hooks/useActivityLogger';

interface TestimonialData {
  content: string;
  author: string;
  role: string;
  organization: string;
  rating: number;
  image_url: string;
  published: boolean;
  display_order: number;
}

export default function TestimonialEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isNew = id === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<TestimonialData>({
    content: '',
    author: '',
    role: '',
    organization: '',
    rating: 5,
    image_url: '',
    published: false,
    display_order: 0,
  });

  useEffect(() => {
    if (!isNew && id) {
      fetchTestimonial();
    }
  }, [id, isNew]);

  const fetchTestimonial = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Témoignage non trouvé',
      });
      navigate('/admin/testimonials');
      return;
    }

    setFormData({
      content: data.content || '',
      author: data.author || '',
      role: data.role || '',
      organization: data.organization || '',
      rating: data.rating || 5,
      image_url: data.image_url || '',
      published: data.published || false,
      display_order: data.display_order || 0,
    });
    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `testimonial-${Date.now()}.${fileExt}`;
    const filePath = `testimonials/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de télécharger l\'image',
      });
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    setFormData(prev => ({ ...prev, image_url: publicUrl }));
    setIsUploading(false);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim() || !formData.author.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le contenu et l\'auteur sont requis',
      });
      return;
    }

    setIsSaving(true);

    const testimonialData = {
      content: formData.content.trim(),
      author: formData.author.trim(),
      role: formData.role.trim() || null,
      organization: formData.organization.trim() || null,
      rating: formData.rating,
      image_url: formData.image_url || null,
      published: formData.published,
      display_order: formData.display_order,
      author_id: user?.id,
    };

    let error;
    if (isNew) {
      const result = await supabase.from('testimonials').insert(testimonialData);
      error = result.error;
    } else {
      const result = await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', id);
      error = result.error;
    }

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder le témoignage',
      });
    } else {
      if (user) {
        await logActivity({
          userId: user.id,
          action: isNew ? 'article_created' : 'article_updated',
          details: { type: 'testimonial', author: formData.author },
        });
      }
      toast({
        title: 'Succès',
        description: isNew ? 'Témoignage créé' : 'Témoignage mis à jour',
      });
      navigate('/admin/testimonials');
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/testimonials')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? 'Nouveau témoignage' : 'Modifier le témoignage'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isNew ? 'Ajoutez un avis client' : 'Modifiez les informations du témoignage'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo */}
        <div className="space-y-2">
          <Label>Photo de l'auteur</Label>
          <div className="flex items-center gap-4">
            {formData.image_url ? (
              <div className="relative">
                <img
                  src={formData.image_url}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-full cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <Upload className="h-5 w-5 text-muted-foreground" />
                )}
              </label>
            )}
          </div>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author">Nom de l'auteur *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            placeholder="Dr. Konan Yao"
            required
          />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Fonction / Poste</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            placeholder="Directeur Régional"
          />
        </div>

        {/* Organization */}
        <div className="space-y-2">
          <Label htmlFor="organization">Organisation</Label>
          <Input
            id="organization"
            value={formData.organization}
            onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
            placeholder="Ministère des Eaux et Forêts"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Témoignage *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="ANE SARL a démontré un professionnalisme exemplaire..."
            rows={4}
            required
          />
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label>Note</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className="p-1"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= formData.rating
                      ? 'fill-copper text-copper'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Display Order */}
        <div className="space-y-2">
          <Label htmlFor="display_order">Ordre d'affichage</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
            min={0}
          />
        </div>

        {/* Published */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="published" className="font-medium">Publié</Label>
            <p className="text-sm text-muted-foreground">
              Rendre ce témoignage visible sur le site
            </p>
          </div>
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/testimonials')}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving} className="flex-1">
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isNew ? 'Créer' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
}
