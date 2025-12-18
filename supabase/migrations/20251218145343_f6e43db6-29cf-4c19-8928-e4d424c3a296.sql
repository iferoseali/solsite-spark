-- Create templates table (storing the 30 template combinations)
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  layout_id TEXT NOT NULL,
  personality_id TEXT NOT NULL,
  name TEXT NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(layout_id, personality_id)
);

-- Create users table (linked to wallet addresses)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table (user's generated websites)
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id),
  coin_name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  twitter_url TEXT,
  discord_url TEXT,
  telegram_url TEXT,
  dex_link TEXT,
  show_roadmap BOOLEAN DEFAULT true,
  show_faq BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}'::jsonb,
  generated_url TEXT,
  subdomain TEXT UNIQUE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create domains table
CREATE TABLE public.domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  subdomain TEXT NOT NULL,
  custom_domain TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  wallet_address TEXT NOT NULL,
  sol_amount DECIMAL(18, 9) NOT NULL,
  payment_type TEXT NOT NULL,
  transaction_signature TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Templates are public (read-only for everyone)
CREATE POLICY "Templates are viewable by everyone" 
ON public.templates FOR SELECT USING (true);

-- Users can view/update their own data
CREATE POLICY "Users can view their own data" 
ON public.users FOR SELECT USING (wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address');

CREATE POLICY "Users can update their own data" 
ON public.users FOR UPDATE USING (wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address');

CREATE POLICY "Users can insert their own data" 
ON public.users FOR INSERT WITH CHECK (true);

-- Projects policies
CREATE POLICY "Users can view their own projects" 
ON public.projects FOR SELECT USING (
  user_id IN (SELECT id FROM public.users WHERE wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address')
);

CREATE POLICY "Users can create their own projects" 
ON public.projects FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.users WHERE wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address')
);

CREATE POLICY "Users can update their own projects" 
ON public.projects FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address')
);

CREATE POLICY "Users can delete their own projects" 
ON public.projects FOR DELETE USING (
  user_id IN (SELECT id FROM public.users WHERE wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address')
);

-- Public can view published projects (for generated websites)
CREATE POLICY "Anyone can view published projects" 
ON public.projects FOR SELECT USING (status = 'published');

-- Domains policies
CREATE POLICY "Users can view their own domains" 
ON public.domains FOR SELECT USING (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id IN (
      SELECT id FROM public.users WHERE wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address'
    )
  )
);

CREATE POLICY "Users can manage their own domains" 
ON public.domains FOR ALL USING (
  project_id IN (
    SELECT id FROM public.projects WHERE user_id IN (
      SELECT id FROM public.users WHERE wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address'
    )
  )
);

-- Payments policies
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT USING (
  wallet_address = current_setting('request.headers', true)::json->>'x-wallet-address'
);

CREATE POLICY "Users can create payments" 
ON public.payments FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_domains_updated_at
  BEFORE UPDATE ON public.domains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default templates (6 layouts × 5 personalities = 30 templates)
INSERT INTO public.templates (layout_id, personality_id, name, config) VALUES
  ('minimal', 'degen', 'Minimal Degen', '{"primary_color": "#ff4444", "accent_color": "#ff8800"}'),
  ('minimal', 'professional', 'Minimal Professional', '{"primary_color": "#0088ff", "accent_color": "#00ccff"}'),
  ('minimal', 'dark-cult', 'Minimal Dark Cult', '{"primary_color": "#8800ff", "accent_color": "#ff00ff"}'),
  ('minimal', 'playful', 'Minimal Playful', '{"primary_color": "#ffcc00", "accent_color": "#00ff88"}'),
  ('minimal', 'premium', 'Minimal Premium', '{"primary_color": "#888888", "accent_color": "#cccccc"}'),
  
  ('hero-roadmap', 'degen', 'Hero Degen', '{"primary_color": "#ff4444", "accent_color": "#ff8800"}'),
  ('hero-roadmap', 'professional', 'Hero Professional', '{"primary_color": "#0088ff", "accent_color": "#00ccff"}'),
  ('hero-roadmap', 'dark-cult', 'Hero Dark Cult', '{"primary_color": "#8800ff", "accent_color": "#ff00ff"}'),
  ('hero-roadmap', 'playful', 'Hero Playful', '{"primary_color": "#ffcc00", "accent_color": "#00ff88"}'),
  ('hero-roadmap', 'premium', 'Hero Premium', '{"primary_color": "#888888", "accent_color": "#cccccc"}'),
  
  ('story-lore', 'degen', 'Story Degen', '{"primary_color": "#ff4444", "accent_color": "#ff8800"}'),
  ('story-lore', 'professional', 'Story Professional', '{"primary_color": "#0088ff", "accent_color": "#00ccff"}'),
  ('story-lore', 'dark-cult', 'Story Dark Cult', '{"primary_color": "#8800ff", "accent_color": "#ff00ff"}'),
  ('story-lore', 'playful', 'Story Playful', '{"primary_color": "#ffcc00", "accent_color": "#00ff88"}'),
  ('story-lore', 'premium', 'Story Premium', '{"primary_color": "#888888", "accent_color": "#cccccc"}'),
  
  ('stats-heavy', 'degen', 'Stats Degen', '{"primary_color": "#ff4444", "accent_color": "#ff8800"}'),
  ('stats-heavy', 'professional', 'Stats Professional', '{"primary_color": "#0088ff", "accent_color": "#00ccff"}'),
  ('stats-heavy', 'dark-cult', 'Stats Dark Cult', '{"primary_color": "#8800ff", "accent_color": "#ff00ff"}'),
  ('stats-heavy', 'playful', 'Stats Playful', '{"primary_color": "#ffcc00", "accent_color": "#00ff88"}'),
  ('stats-heavy', 'premium', 'Stats Premium', '{"primary_color": "#888888", "accent_color": "#cccccc"}'),
  
  ('community', 'degen', 'Community Degen', '{"primary_color": "#ff4444", "accent_color": "#ff8800"}'),
  ('community', 'professional', 'Community Professional', '{"primary_color": "#0088ff", "accent_color": "#00ccff"}'),
  ('community', 'dark-cult', 'Community Dark Cult', '{"primary_color": "#8800ff", "accent_color": "#ff00ff"}'),
  ('community', 'playful', 'Community Playful', '{"primary_color": "#ffcc00", "accent_color": "#00ff88"}'),
  ('community', 'premium', 'Community Premium', '{"primary_color": "#888888", "accent_color": "#cccccc"}'),
  
  ('utility', 'degen', 'Utility Degen', '{"primary_color": "#ff4444", "accent_color": "#ff8800"}'),
  ('utility', 'professional', 'Utility Professional', '{"primary_color": "#0088ff", "accent_color": "#00ccff"}'),
  ('utility', 'dark-cult', 'Utility Dark Cult', '{"primary_color": "#8800ff", "accent_color": "#ff00ff"}'),
  ('utility', 'playful', 'Utility Playful', '{"primary_color": "#ffcc00", "accent_color": "#00ff88"}'),
  ('utility', 'premium', 'Utility Premium', '{"primary_color": "#888888", "accent_color": "#cccccc"}');