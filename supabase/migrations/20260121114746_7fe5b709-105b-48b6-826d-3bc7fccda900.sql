-- Create hero_slides table
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  badge TEXT,
  headline TEXT NOT NULL,
  highlight TEXT,
  description TEXT,
  image_url TEXT,
  button_text TEXT DEFAULT 'Découvrir nos services',
  button_link TEXT DEFAULT '#services',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Public can view active slides
CREATE POLICY "Anyone can view active slides"
ON public.hero_slides
FOR SELECT
USING (is_active = true);

-- Admins and moderators can view all slides
CREATE POLICY "Admins and moderators can view all slides"
ON public.hero_slides
FOR SELECT
USING (is_admin_or_moderator(auth.uid()));

-- Admins and moderators can create slides
CREATE POLICY "Admins and moderators can create slides"
ON public.hero_slides
FOR INSERT
WITH CHECK (is_admin_or_moderator(auth.uid()));

-- Admins and moderators can update slides
CREATE POLICY "Admins and moderators can update slides"
ON public.hero_slides
FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

-- Admins can delete slides
CREATE POLICY "Admins can delete slides"
ON public.hero_slides
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON public.hero_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();