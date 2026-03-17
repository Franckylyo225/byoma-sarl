-- Add archived column to articles table
ALTER TABLE public.articles 
ADD COLUMN archived boolean DEFAULT false;

-- Update RLS policy to exclude archived articles from public view
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.articles;
CREATE POLICY "Anyone can view published non-archived articles" 
ON public.articles 
FOR SELECT 
USING (published = true AND (archived = false OR archived IS NULL));