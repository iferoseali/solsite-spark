-- Add RLS policies for users to manage their own projects
-- Drop the restrictive SELECT policy and replace with proper policies

-- Users can view their own projects (draft or published)
CREATE POLICY "Users can view their own projects"
ON public.projects
FOR SELECT
USING (
  user_id IN (
    SELECT id FROM users 
    WHERE wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
  )
);

-- Users can insert their own projects
CREATE POLICY "Users can insert their own projects"
ON public.projects
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT id FROM users 
    WHERE wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
  )
);

-- Users can update their own projects
CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
USING (
  user_id IN (
    SELECT id FROM users 
    WHERE wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
  )
);

-- Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
ON public.projects
FOR DELETE
USING (
  user_id IN (
    SELECT id FROM users 
    WHERE wallet_address = ((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
  )
);