-- Drop the existing delete policy for project_images
DROP POLICY IF EXISTS "Admins can delete project images" ON public.project_images;

-- Create a new policy that allows both admins and super_admins to delete images
CREATE POLICY "Admins and super admins can delete project images" 
ON public.project_images 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role) OR is_super_admin(auth.uid()));