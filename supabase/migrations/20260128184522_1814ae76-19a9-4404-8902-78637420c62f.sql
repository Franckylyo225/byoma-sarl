-- Create testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  author text NOT NULL,
  role text,
  organization text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url text,
  published boolean DEFAULT false,
  archived boolean DEFAULT false,
  display_order integer DEFAULT 0,
  author_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public can view published non-archived testimonials
CREATE POLICY "Anyone can view published non-archived testimonials"
ON public.testimonials
FOR SELECT
USING (published = true AND (archived = false OR archived IS NULL));

-- Admins and moderators can view all testimonials
CREATE POLICY "Admins and moderators can view all testimonials"
ON public.testimonials
FOR SELECT
USING (is_admin_or_moderator(auth.uid()));

-- Admins and moderators can create testimonials
CREATE POLICY "Admins and moderators can create testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (is_admin_or_moderator(auth.uid()));

-- Admins and moderators can update testimonials
CREATE POLICY "Admins and moderators can update testimonials"
ON public.testimonials
FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

-- Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();