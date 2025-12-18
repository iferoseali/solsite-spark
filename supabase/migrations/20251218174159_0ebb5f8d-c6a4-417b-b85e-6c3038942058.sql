-- Fix overly permissive RLS policies
-- Since this app uses wallet-based auth (not Supabase Auth), we need to:
-- 1. Allow published projects to be publicly viewable (for render-site)
-- 2. Restrict all other access until proper auth is implemented

-- Drop existing overly permissive policies on projects
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Create restrictive policies for projects
-- Published projects can be viewed by anyone (needed for render-site)
CREATE POLICY "Published projects are viewable by everyone" 
ON public.projects 
FOR SELECT 
USING (status = 'published');

-- Block all INSERT/UPDATE/DELETE until proper auth is implemented
-- These operations require authenticated access via edge functions

-- Drop existing overly permissive policies on users
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Users table should not be directly accessible - managed via edge functions
-- No policies = no access (RLS is enabled)

-- Drop existing overly permissive policies on domains
DROP POLICY IF EXISTS "Users can view their own domains" ON public.domains;
DROP POLICY IF EXISTS "Users can manage their own domains" ON public.domains;

-- Domains should only be viewable for verified domains
CREATE POLICY "Active domains are viewable" 
ON public.domains 
FOR SELECT 
USING (status = 'active');

-- Drop existing overly permissive policies on payments
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;

-- Payments should not be accessible via client - managed via edge functions

-- Drop existing overly permissive policies on template_blueprints
DROP POLICY IF EXISTS "Template blueprints are viewable by everyone" ON public.template_blueprints;
DROP POLICY IF EXISTS "Authenticated users can manage template blueprints" ON public.template_blueprints;

-- Active templates are viewable by everyone
CREATE POLICY "Active template blueprints are viewable" 
ON public.template_blueprints 
FOR SELECT 
USING (is_active = true);