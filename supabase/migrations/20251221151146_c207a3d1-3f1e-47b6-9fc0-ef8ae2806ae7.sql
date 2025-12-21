-- Insert 8 Premium Templates into template_blueprints
INSERT INTO public.template_blueprints (name, personality, layout_category, is_active, styles, sections, animations)
VALUES 
  (
    'Genesis Pump',
    'degen',
    'minimal',
    true,
    '{"theme": "dark", "background": "animated-gradient", "primaryColor": "#14F195", "secondaryColor": "#0A0A0A", "font": "Inter"}'::jsonb,
    '[
      {"type": "hero", "variant": "fullscreen", "enabled": true, "editableFields": ["headline", "subheadline", "ctaPrimary", "ctaSecondary"]},
      {"type": "utility", "variant": "horizontal", "enabled": true, "editableFields": ["cards"]},
      {"type": "tokenomics", "variant": "grid", "enabled": true, "editableFields": ["items"]}
    ]'::jsonb,
    '{"pageLoad": "fade-up", "scroll": "parallax", "hover": "glow-scale"}'::jsonb
  ),
  (
    'Velocity Dark',
    'professional',
    'minimal',
    true,
    '{"theme": "dark-minimal", "background": "solid-black", "primaryColor": "#FFFFFF", "accentColor": "#14F195", "font": "Space Grotesk"}'::jsonb,
    '[
      {"type": "hero", "variant": "minimal", "enabled": true, "editableFields": ["headline", "subheadline", "ctaPrimary"]},
      {"type": "features", "variant": "default", "enabled": true, "editableFields": ["items"]},
      {"type": "community", "variant": "horizontal", "enabled": true, "editableFields": ["logos"]}
    ]'::jsonb,
    '{"pageLoad": "fade", "scroll": "fade-in", "hover": "underline-slide"}'::jsonb
  ),
  (
    'Meme Matrix',
    'degen',
    'hero-roadmap',
    true,
    '{"theme": "dark-neon", "background": "animated-grid", "primaryColor": "#00FFCC", "accentColor": "#FF00FF", "font": "JetBrains Mono"}'::jsonb,
    '[
      {"type": "hero", "variant": "fullscreen", "enabled": true, "editableFields": ["headline", "subheadline", "ctaPrimary"]},
      {"type": "utility", "variant": "horizontal", "enabled": true, "editableFields": ["images"]},
      {"type": "roadmap", "variant": "horizontal", "enabled": true, "editableFields": ["phases"]}
    ]'::jsonb,
    '{"pageLoad": "zoom-in", "scroll": "tilt", "hover": "shake-pop"}'::jsonb
  ),
  (
    'Orbit Launchpad',
    'professional',
    'stats-heavy',
    true,
    '{"theme": "dark-glass", "background": "blurred-gradient", "primaryColor": "#14F195", "font": "Satoshi"}'::jsonb,
    '[
      {"type": "hero", "variant": "centered", "enabled": true, "editableFields": ["headline", "ctaPrimary"]},
      {"type": "tokenomics", "variant": "cards", "enabled": true, "editableFields": ["items"]},
      {"type": "utility", "variant": "horizontal", "enabled": true, "editableFields": ["cards"]}
    ]'::jsonb,
    '{"pageLoad": "fade-up", "scroll": "slide-up", "hover": "lift-shadow"}'::jsonb
  ),
  (
    'Stealth Drop',
    'dark-cult',
    'minimal',
    true,
    '{"theme": "blackout", "background": "grain-dark", "primaryColor": "#FFFFFF", "accentColor": "#14F195", "font": "DM Sans"}'::jsonb,
    '[
      {"type": "hero", "variant": "minimal", "enabled": true, "editableFields": ["headline", "ctaPrimary"]},
      {"type": "story", "variant": "default", "enabled": true, "editableFields": ["headline", "text"]},
      {"type": "utility", "variant": "horizontal", "enabled": true, "editableFields": ["cards"]}
    ]'::jsonb,
    '{"pageLoad": "fade-black", "scroll": "reveal", "hover": "glitch"}'::jsonb
  ),
  (
    'Pump.fun Hero',
    'degen',
    'minimal',
    true,
    '{"theme": "terminal-dark", "background": "noise-black", "primaryColor": "#14F195", "font": "JetBrains Mono"}'::jsonb,
    '[
      {"type": "hero", "variant": "minimal", "enabled": true, "editableFields": ["headline", "ctaPrimary"]},
      {"type": "story", "variant": "default", "enabled": true, "editableFields": ["text"]}
    ]'::jsonb,
    '{"pageLoad": "typewriter", "hover": "blink"}'::jsonb
  ),
  (
    'Chart Maxi',
    'degen',
    'minimal',
    true,
    '{"theme": "black", "background": "chart-grid", "primaryColor": "#00FF00", "font": "Inter"}'::jsonb,
    '[
      {"type": "hero", "variant": "centered", "enabled": true, "editableFields": ["headline"]},
      {"type": "utility", "variant": "horizontal", "enabled": true, "editableFields": ["cards"]}
    ]'::jsonb,
    '{"scroll": "fade-in", "hover": "scale"}'::jsonb
  ),
  (
    'Zero Info',
    'degen',
    'minimal',
    true,
    '{"theme": "brutalist", "background": "plain-black", "primaryColor": "#FFFFFF", "font": "Arial"}'::jsonb,
    '[
      {"type": "hero", "variant": "minimal", "enabled": true, "editableFields": ["headline", "ctaPrimary"]}
    ]'::jsonb,
    '{"pageLoad": "none", "hover": "none"}'::jsonb
  );