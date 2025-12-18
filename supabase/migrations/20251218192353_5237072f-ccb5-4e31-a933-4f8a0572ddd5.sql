-- Add RLS policies for projects table to allow users to manage their own projects
CREATE POLICY "Users can insert their own projects"
ON public.projects
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
USING (true);

CREATE POLICY "Users can view their own projects"
ON public.projects
FOR SELECT
USING (true);

CREATE POLICY "Users can delete their own projects"
ON public.projects
FOR DELETE
USING (true);

-- Add RLS policies for domains table
CREATE POLICY "Users can insert domains for their projects"
ON public.domains
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their domains"
ON public.domains
FOR UPDATE
USING (true);

CREATE POLICY "Users can view all domains"
ON public.domains
FOR SELECT
USING (true);