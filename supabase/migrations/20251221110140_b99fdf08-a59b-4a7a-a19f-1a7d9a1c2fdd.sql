-- Fix project RLS: avoid selecting from users table (which has RLS enabled) by using a SECURITY DEFINER helper

-- 1) Helper to map JWT wallet_address claim -> public.users.id
CREATE OR REPLACE FUNCTION public.current_app_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id
  FROM public.users u
  WHERE u.wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
  LIMIT 1
$$;

-- 2) Replace earlier policies (if present)
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- 3) Create non-recursive policies based on current_app_user_id()
CREATE POLICY "Users can view their own projects"
ON public.projects
FOR SELECT
USING (user_id = public.current_app_user_id());

CREATE POLICY "Users can create their own projects"
ON public.projects
FOR INSERT
WITH CHECK (user_id = public.current_app_user_id());

CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
USING (user_id = public.current_app_user_id())
WITH CHECK (user_id = public.current_app_user_id());

CREATE POLICY "Users can delete their own projects"
ON public.projects
FOR DELETE
USING (user_id = public.current_app_user_id());
