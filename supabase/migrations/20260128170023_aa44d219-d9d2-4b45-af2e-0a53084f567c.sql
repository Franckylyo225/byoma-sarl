-- Create a function to check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
      AND is_approved = true
  )
$$;

-- Update the is_admin_or_moderator function to check approval status
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'moderator', 'super_admin')
      AND is_approved = true
  )
$$;

-- Update has_role to check approval status
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_approved = true
  )
$$;

-- Policy for super_admin to update roles (for approval)
CREATE POLICY "Super admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (is_super_admin(auth.uid()));

-- Super admins can view all roles including pending
CREATE POLICY "Super admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (is_super_admin(auth.uid()));