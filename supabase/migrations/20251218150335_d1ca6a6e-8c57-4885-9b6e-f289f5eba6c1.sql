-- Drop existing RESTRICTIVE policies on users table
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Recreate as PERMISSIVE policies (which is the default behavior)
CREATE POLICY "Users can insert their own data" 
ON public.users 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Also fix projects table policies
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;

CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
TO anon, authenticated
USING (true);

-- Fix templates policy
DROP POLICY IF EXISTS "Templates are viewable by everyone" ON public.templates;

CREATE POLICY "Templates are viewable by everyone" 
ON public.templates 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Fix domains policies  
DROP POLICY IF EXISTS "Users can view their own domains" ON public.domains;
DROP POLICY IF EXISTS "Users can manage their own domains" ON public.domains;

CREATE POLICY "Users can view their own domains" 
ON public.domains 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Users can manage their own domains" 
ON public.domains 
FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Fix payments policies
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;

CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Users can create payments" 
ON public.payments 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);