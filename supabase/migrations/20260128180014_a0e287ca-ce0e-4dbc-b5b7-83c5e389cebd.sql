-- Add archived column to projects table
ALTER TABLE public.projects 
ADD COLUMN archived boolean DEFAULT false;

-- Update RLS policy to exclude archived projects from public view
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;
CREATE POLICY "Anyone can view published non-archived projects" 
ON public.projects 
FOR SELECT 
USING (published = true AND (archived = false OR archived IS NULL));