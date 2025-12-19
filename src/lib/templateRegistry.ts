// Solsite Internal Template Registry
// Version 2.0 - With Layout Variants

export interface TemplateSection {
  type: string;
  variant: string;
  animation?: 'fade-in' | 'fade-up' | 'slide-left' | 'slide-right' | 'horizontal-scroll' | 'parallax' | 'stagger' | 'bounce' | 'none';
  fields: string[];
}

export interface TemplateTheme {
  background: string;
  primary: string;
  accent: string;
  text: string;
}

export interface TemplateDefinition {
  template_id: string;
  name: string;
  inspiration: string;
  category: 'horizontal-scroll' | 'vertical' | 'hybrid';
  theme: TemplateTheme;
  sections: TemplateSection[];
}

export interface TemplateRegistry {
  platform: string;
  version: string;
  default_theme: {
    mode: string;
    light_mode_enabled: boolean;
  };
  templates: TemplateDefinition[];
}

export const SOLSITE_TEMPLATE_REGISTRY: TemplateRegistry = {
  platform: "Solsite",
  version: "2.0",
  default_theme: {
    mode: "dark",
    light_mode_enabled: true
  },
  templates: [
    {
      template_id: "cult_minimal",
      name: "Cult Minimal",
      inspiration: "Pump.fun, early Solana cult sites",
      category: "vertical",
      theme: { background: "#0b0b0b", primary: "#a6ff00", accent: "#7acc00", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "minimal", animation: "fade-in", fields: ["coin_name", "ticker", "tagline", "logo"] },
        { type: "tokenomics", variant: "grid", animation: "fade-up", fields: ["stats"] },
        { type: "roadmap", variant: "timeline", animation: "fade-up", fields: ["phases"] },
        { type: "faq", variant: "default", animation: "fade-in", fields: ["items"] },
      ]
    },
    {
      template_id: "vc_pro",
      name: "VC Grade Pro",
      inspiration: "Coinbase, Solana.com",
      category: "vertical",
      theme: { background: "#0e1117", primary: "#5da9ff", accent: "#0088ff", text: "#e6e6e6" },
      sections: [
        { type: "hero", variant: "split", animation: "fade-in", fields: ["coin_name", "tagline", "hero_image"] },
        { type: "tokenomics", variant: "cards", animation: "stagger", fields: ["stats"] },
        { type: "roadmap", variant: "cards", animation: "fade-up", fields: ["phases"] },
        { type: "community", variant: "default", animation: "fade-in", fields: ["socials"] },
      ]
    },
    {
      template_id: "degen_meme",
      name: "Degenerate Meme",
      inspiration: "BONK, PEPE launch pages",
      category: "horizontal-scroll",
      theme: { background: "#120018", primary: "#ff4fd8", accent: "#ff8800", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "fullscreen", animation: "bounce", fields: ["coin_name", "ticker", "meme_image"] },
        { type: "tokenomics", variant: "horizontal", animation: "horizontal-scroll", fields: ["stats"] },
        { type: "roadmap", variant: "horizontal", animation: "horizontal-scroll", fields: ["phases"] },
        { type: "community", variant: "default", animation: "fade-up", fields: ["socials"] },
      ]
    },
    {
      template_id: "dark_cult",
      name: "Dark Cult Narrative",
      inspiration: "CultDAO, lore-heavy Web3 brands",
      category: "vertical",
      theme: { background: "#050505", primary: "#ff0000", accent: "#8b0000", text: "#f5f5f5" },
      sections: [
        { type: "hero", variant: "centered", animation: "fade-in", fields: ["coin_name", "tagline"] },
        { type: "story", variant: "default", animation: "parallax", fields: ["lore"] },
        { type: "tokenomics", variant: "circular", animation: "fade-up", fields: ["stats"] },
        { type: "roadmap", variant: "zigzag", animation: "slide-left", fields: ["phases"] },
      ]
    },
    {
      template_id: "luxury_token",
      name: "Luxury Token",
      inspiration: "Premium NFT & token brands",
      category: "vertical",
      theme: { background: "#0a0a0a", primary: "#d4af37", accent: "#c0c0c0", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "minimal", animation: "fade-in", fields: ["coin_name", "tagline", "logo"] },
        { type: "tokenomics", variant: "cards", animation: "stagger", fields: ["stats"] },
        { type: "team", variant: "default", animation: "fade-up", fields: ["members"] },
        { type: "roadmap", variant: "timeline", animation: "fade-up", fields: ["phases"] },
      ]
    },
    {
      template_id: "scroll_story",
      name: "Scroll Story",
      inspiration: "Immersive storytelling sites",
      category: "horizontal-scroll",
      theme: { background: "#0d1520", primary: "#00d4ff", accent: "#22c55e", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "fullscreen", animation: "parallax", fields: ["coin_name", "tagline"] },
        { type: "story", variant: "default", animation: "horizontal-scroll", fields: ["chapters"] },
        { type: "tokenomics", variant: "horizontal", animation: "horizontal-scroll", fields: ["stats"] },
        { type: "roadmap", variant: "horizontal", animation: "horizontal-scroll", fields: ["phases"] },
      ]
    },
    {
      template_id: "neo_grid",
      name: "Neo Grid",
      inspiration: "Modern SaaS & Web3 dashboards",
      category: "horizontal-scroll",
      theme: { background: "#0f0f0f", primary: "#8b5cf6", accent: "#ec4899", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "asymmetric", animation: "fade-in", fields: ["coin_name", "ticker", "tagline"] },
        { type: "tokenomics", variant: "grid", animation: "stagger", fields: ["stats"] },
        { type: "utility", variant: "default", animation: "horizontal-scroll", fields: ["features"] },
        { type: "roadmap", variant: "cards", animation: "fade-up", fields: ["phases"] },
      ]
    },
    {
      template_id: "builder_utility",
      name: "Builder Utility",
      inspiration: "Web3 dev tools & infra",
      category: "vertical",
      theme: { background: "#0d1117", primary: "#00ffa3", accent: "#00d4ff", text: "#c9d1d9" },
      sections: [
        { type: "hero", variant: "split", animation: "fade-in", fields: ["coin_name", "utility_tagline"] },
        { type: "utility", variant: "default", animation: "fade-up", fields: ["features"] },
        { type: "tokenomics", variant: "grid", animation: "fade-up", fields: ["stats"] },
        { type: "roadmap", variant: "timeline", animation: "fade-up", fields: ["phases"] },
      ]
    }
  ]
};

export function getTemplateById(templateId: string): TemplateDefinition | undefined {
  return SOLSITE_TEMPLATE_REGISTRY.templates.find(t => t.template_id === templateId);
}

export function getTemplateIds(): string[] {
  return SOLSITE_TEMPLATE_REGISTRY.templates.map(t => t.template_id);
}

export function getTemplateOptions(): { id: string; name: string; inspiration: string; category: string }[] {
  return SOLSITE_TEMPLATE_REGISTRY.templates.map(t => ({
    id: t.template_id,
    name: t.name,
    inspiration: t.inspiration,
    category: t.category
  }));
}

export function getHorizontalScrollTemplates(): string[] {
  return SOLSITE_TEMPLATE_REGISTRY.templates
    .filter(t => t.category === 'horizontal-scroll')
    .map(t => t.template_id);
}
