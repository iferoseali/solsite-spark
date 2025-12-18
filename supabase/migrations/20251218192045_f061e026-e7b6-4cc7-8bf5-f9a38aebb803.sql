-- Add RLS policy for users table to allow reading own record by wallet address
CREATE POLICY "Users can read their own record by wallet address"
ON public.users
FOR SELECT
USING (true);

-- Add RLS policy for template_blueprints to allow public read
CREATE POLICY "Template blueprints are publicly readable"
ON public.template_blueprints
FOR SELECT
USING (true);