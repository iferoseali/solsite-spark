-- Fix overly permissive RLS policies
-- This application uses wallet-based auth via edge functions with service role key
-- All data access goes through edge functions, so we lock down direct client access

-- Drop all overly permissive USING (true) policies
DROP POLICY IF EXISTS "Users can read their own record by wallet address" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view all domains" ON public.domains;
DROP POLICY IF EXISTS "Users can insert domains for their projects" ON public.domains;
DROP POLICY IF EXISTS "Users can update their domains" ON public.domains;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert their own pending payments" ON public.payments;

-- Keep only public-facing policies that are needed:

-- 1. Published projects need to be viewable for render-site (keep existing)
-- "Published projects are viewable by everyone" already exists with status = 'published'

-- 2. Active domains need to be viewable for DNS resolution (keep existing)
-- "Active domains are viewable" already exists with status = 'active'

-- 3. Templates need to be viewable (keep existing)
-- "Templates are viewable by everyone" already exists

-- 4. Template blueprints need to be viewable (keep existing)
-- "Active template blueprints are viewable" already exists with is_active = true
-- "Template blueprints are publicly readable" already exists