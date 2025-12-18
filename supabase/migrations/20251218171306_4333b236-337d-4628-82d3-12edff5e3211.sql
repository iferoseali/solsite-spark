-- Create template_blueprints table for rich template configurations
CREATE TABLE public.template_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  reference_url TEXT,
  
  -- Section definitions (JSON array)
  sections JSONB NOT NULL DEFAULT '[]',
  
  -- Style configuration
  styles JSONB NOT NULL DEFAULT '{}',
  
  -- Animation configuration
  animations JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  layout_category TEXT,
  personality TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.template_blueprints ENABLE ROW LEVEL SECURITY;

-- Templates are viewable by everyone (public templates)
CREATE POLICY "Template blueprints are viewable by everyone"
ON public.template_blueprints
FOR SELECT
USING (is_active = true);

-- Only admins can manage templates (for now, allow all authenticated for internal use)
CREATE POLICY "Authenticated users can manage template blueprints"
ON public.template_blueprints
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_template_blueprints_updated_at
BEFORE UPDATE ON public.template_blueprints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();