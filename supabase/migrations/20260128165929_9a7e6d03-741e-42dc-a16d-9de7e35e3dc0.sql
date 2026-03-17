-- Add super_admin to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Add is_approved column to user_roles with default false for new roles
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

-- Update existing roles to be approved (they were created before this system)
UPDATE public.user_roles SET is_approved = true WHERE is_approved IS NULL;

-- Make the column not nullable after setting existing values
ALTER TABLE public.user_roles ALTER COLUMN is_approved SET NOT NULL;