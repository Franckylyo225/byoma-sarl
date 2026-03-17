-- Create services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'Compass',
  features text[] DEFAULT '{}',
  href text,
  published boolean DEFAULT false,
  archived boolean DEFAULT false,
  display_order integer DEFAULT 0,
  author_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public can view published non-archived services
CREATE POLICY "Anyone can view published non-archived services"
ON public.services
FOR SELECT
USING (published = true AND (archived = false OR archived IS NULL));

-- Admins and moderators can view all services
CREATE POLICY "Admins and moderators can view all services"
ON public.services
FOR SELECT
USING (is_admin_or_moderator(auth.uid()));

-- Admins and moderators can create services
CREATE POLICY "Admins and moderators can create services"
ON public.services
FOR INSERT
WITH CHECK (is_admin_or_moderator(auth.uid()));

-- Admins and moderators can update services
CREATE POLICY "Admins and moderators can update services"
ON public.services
FOR UPDATE
USING (is_admin_or_moderator(auth.uid()));

-- Admins can delete services
CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();