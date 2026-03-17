-- Drop and recreate the policies as PERMISSIVE for articles
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.articles;
CREATE POLICY "Anyone can view published articles" 
ON public.articles 
FOR SELECT 
TO public
USING (published = true);

-- Drop and recreate the policies as PERMISSIVE for projects
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;
CREATE POLICY "Anyone can view published projects" 
ON public.projects 
FOR SELECT 
TO public
USING (published = true);

-- Drop and recreate the policies as PERMISSIVE for project_images
DROP POLICY IF EXISTS "Anyone can view images of published projects" ON public.project_images;
CREATE POLICY "Anyone can view images of published projects" 
ON public.project_images 
FOR SELECT 
TO public
USING (EXISTS ( 
  SELECT 1 FROM projects 
  WHERE projects.id = project_images.project_id 
  AND projects.published = true
));