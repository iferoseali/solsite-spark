// Solsite Template System - Consolidated module
// Combines template data, registry, and metadata into a single source of truth

// ============================================
// TYPES
// ============================================

export type Category = "all" | "meme" | "professional" | "gaming" | "tech" | "minimal" | "community";
export type SortOption = "name" | "newest" | "popular";

export interface TemplateMeta {
  emoji: string;
  tagline: string;
  features: string[];
  category: Category;
  popularity: number;
}

export interface CategoryOption {
  id: Category;
  label: string;
  emoji: string;
}

export interface SortOptionItem {
  id: SortOption;
  label: string;
}

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
  tier?: 'standard' | 'premium';
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

// ============================================
// CONSTANTS
// ============================================

// Map blueprint names to render-site templateId
export const TEMPLATE_ID_MAP: Record<string, string> = {
  "Cult Minimal": "cult_minimal",
  "VC Grade Pro": "vc_pro",
  "Degenerate Meme": "degen_meme",
  "Dark Cult Narrative": "dark_cult",
  "Luxury Token": "luxury_token",
  "Builder Utility": "builder_utility",
  "Neo Grid": "neo_grid",
  "Scroll Story": "scroll_story",
  "Web3 Gaming": "web3_gaming",
  "AI Crypto": "ai_crypto",
  "DAO Portal": "dao_portal",
  "Ultra Brutalist": "ultra_brutalist",
  "Infra Terminal": "infra_terminal",
  "Social First": "social_first",
  "Futuristic 3D": "futuristic_3d",
  // Premium templates
  "Genesis Pump": "premium_genesis_pump",
  "Velocity Dark": "premium_velocity_dark",
  "Meme Matrix": "premium_meme_matrix",
  "Orbit Launchpad": "premium_orbit_launchpad",
  "Stealth Drop": "premium_stealth_drop",
  "Pump.fun Hero": "premium_pump_fun_hero",
  "Chart Maxi": "premium_chart_maxi",
  "Zero Info": "premium_zero_info",
};

// Template categories for filtering
export const TEMPLATE_CATEGORIES: CategoryOption[] = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "meme", label: "Meme", emoji: "🚀" },
  { id: "professional", label: "Pro", emoji: "💼" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "tech", label: "Tech", emoji: "🤖" },
  { id: "minimal", label: "Minimal", emoji: "⚡" },
  { id: "community", label: "Community", emoji: "💬" },
];

// Sort options
export const SORT_OPTIONS: SortOptionItem[] = [
  { id: "name", label: "Name A-Z" },
  { id: "newest", label: "Newest First" },
  { id: "popular", label: "Most Popular" },
];

// Template metadata with category
export const TEMPLATE_META: Record<string, TemplateMeta> = {
  "cult_minimal": { emoji: "⚡", tagline: "Stark, glitchy, monospace aesthetic for cult followings", features: ["Matrix rain effect", "Glitch text animation", "Neon green accents"], category: "minimal", popularity: 85 },
  "vc_pro": { emoji: "💼", tagline: "Clean, professional design that screams legitimacy", features: ["Gradient orb backgrounds", "Glass morphism cards", "Split hero layout"], category: "professional", popularity: 92 },
  "degen_meme": { emoji: "🚀", tagline: "Wild, chaotic energy for maximum degen appeal", features: ["Floating emoji particles", "Shake animations", "Giant ticker display"], category: "meme", popularity: 98 },
  "dark_cult": { emoji: "🌙", tagline: "Mysterious, moody atmosphere for lore-heavy projects", features: ["Fog particle effects", "Serif typography", "Blood red accents"], category: "minimal", popularity: 78 },
  "luxury_token": { emoji: "👑", tagline: "Elegant, refined design for premium positioning", features: ["Gold dust particles", "Shimmer text effects", "Minimal layout"], category: "professional", popularity: 88 },
  "builder_utility": { emoji: "⚙️", tagline: "Terminal-inspired design for utility-focused tokens", features: ["Grid line background", "Monospace fonts", "Dev-focused aesthetic"], category: "tech", popularity: 72 },
  "neo_grid": { emoji: "⬡", tagline: "Modern bento grid layout inspired by zkSync & Starknet", features: ["Cyber grid background", "Bento card layout", "Stagger animations"], category: "tech", popularity: 90 },
  "scroll_story": { emoji: "📜", tagline: "Minimal narrative scroll for story-driven launches", features: ["Full-screen text", "Scroll reveal effects", "Serif typography"], category: "minimal", popularity: 65 },
  "web3_gaming": { emoji: "🎮", tagline: "Neon arcade aesthetic for gaming tokens", features: ["Scanline overlay", "Neon glow effects", "Media-left hero"], category: "gaming", popularity: 82 },
  "ai_crypto": { emoji: "🤖", tagline: "Futuristic glow design for AI & tech projects", features: ["Neural network bg", "Glowing rings", "Tech-forward look"], category: "tech", popularity: 95 },
  "dao_portal": { emoji: "⬢", tagline: "Dashboard-style layout for governance tokens", features: ["Stats display", "Purple accents", "Clean governance UI"], category: "community", popularity: 70 },
  "ultra_brutalist": { emoji: "◼", tagline: "Raw anti-design for maximum contrast", features: ["Black & white only", "No animations", "Bold typography"], category: "minimal", popularity: 60 },
  "infra_terminal": { emoji: "💻", tagline: "CLI-inspired design for infrastructure projects", features: ["Terminal window", "Typing animation", "Matrix effect"], category: "tech", popularity: 75 },
  "social_first": { emoji: "💬", tagline: "Community-focused design with warm tones", features: ["Avatar focus", "Social proof", "Yellow accents"], category: "community", popularity: 68 },
  "futuristic_3d": { emoji: "🌌", tagline: "Immersive holographic design for premium launches", features: ["3D space bg", "Floating shapes", "Hologram buttons"], category: "professional", popularity: 87 },
  // Premium templates
  "premium_genesis_pump": { emoji: "💎", tagline: "Animated gradient memecoin launch template", features: ["Animated gradient bg", "Parallax scroll", "Glow hover effects"], category: "meme", popularity: 99 },
  "premium_velocity_dark": { emoji: "🖤", tagline: "Minimal dark design for serious projects", features: ["Solid black bg", "Clean typography", "Underline animations"], category: "professional", popularity: 96 },
  "premium_meme_matrix": { emoji: "🌐", tagline: "Neon cyberpunk aesthetic for viral memes", features: ["Animated grid bg", "Tilt scroll effects", "Shake-pop hovers"], category: "meme", popularity: 97 },
  "premium_orbit_launchpad": { emoji: "🚀", tagline: "Glassmorphism design for startup launches", features: ["Blurred gradients", "Slide animations", "Lift shadows"], category: "professional", popularity: 94 },
  "premium_stealth_drop": { emoji: "🥷", tagline: "Mysterious blackout design for stealth launches", features: ["Grain texture", "Reveal animations", "Glitch effects"], category: "minimal", popularity: 93 },
  "premium_pump_fun_hero": { emoji: "💹", tagline: "Terminal-style pump.fun inspired design", features: ["Noise black bg", "Typewriter effect", "Blink hovers"], category: "meme", popularity: 98 },
  "premium_chart_maxi": { emoji: "📈", tagline: "Chart-focused design for traders", features: ["Chart grid bg", "Scale hovers", "Bold typography"], category: "meme", popularity: 95 },
  "premium_zero_info": { emoji: "⬛", tagline: "Ultra-minimal brutalist design", features: ["Plain black bg", "No animations", "Raw typography"], category: "minimal", popularity: 90 },
};

// ============================================
// TEMPLATE REGISTRY
// ============================================

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
    },
    // Premium Templates
    {
      template_id: "premium_genesis_pump",
      name: "Genesis Pump",
      inspiration: "High-energy memecoin launches",
      category: "horizontal-scroll",
      tier: "premium",
      theme: { background: "#0A0A0A", primary: "#14F195", accent: "#14F195", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "fullscreen", animation: "fade-up", fields: ["coin_name", "ticker", "tagline", "cta_primary", "cta_secondary"] },
        { type: "utility", variant: "horizontal", animation: "horizontal-scroll", fields: ["cards"] },
        { type: "tokenomics", variant: "grid", animation: "fade-up", fields: ["stats"] },
      ]
    },
    {
      template_id: "premium_velocity_dark",
      name: "Velocity Dark",
      inspiration: "Clean Solana infrastructure projects",
      category: "vertical",
      tier: "premium",
      theme: { background: "#000000", primary: "#FFFFFF", accent: "#14F195", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "minimal", animation: "fade-in", fields: ["coin_name", "tagline", "cta_primary"] },
        { type: "utility", variant: "default", animation: "fade-in", fields: ["features"] },
        { type: "community", variant: "horizontal", animation: "horizontal-scroll", fields: ["logos"] },
      ]
    },
    {
      template_id: "premium_meme_matrix",
      name: "Meme Matrix",
      inspiration: "Cyberpunk viral meme tokens",
      category: "horizontal-scroll",
      tier: "premium",
      theme: { background: "#0A0A0A", primary: "#00FFCC", accent: "#FF00FF", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "fullscreen", animation: "fade-up", fields: ["coin_name", "tagline", "cta_primary"] },
        { type: "utility", variant: "horizontal", animation: "horizontal-scroll", fields: ["images"] },
        { type: "roadmap", variant: "horizontal", animation: "horizontal-scroll", fields: ["phases"] },
      ]
    },
    {
      template_id: "premium_orbit_launchpad",
      name: "Orbit Launchpad",
      inspiration: "Solana startup launches",
      category: "horizontal-scroll",
      tier: "premium",
      theme: { background: "#0A0F1A", primary: "#14F195", accent: "#00d4ff", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "centered", animation: "fade-up", fields: ["coin_name", "cta_primary"] },
        { type: "tokenomics", variant: "cards", animation: "stagger", fields: ["stats"] },
        { type: "utility", variant: "horizontal", animation: "horizontal-scroll", fields: ["cards"] },
      ]
    },
    {
      template_id: "premium_stealth_drop",
      name: "Stealth Drop",
      inspiration: "Mysterious stealth launches",
      category: "horizontal-scroll",
      tier: "premium",
      theme: { background: "#0A0A0A", primary: "#FFFFFF", accent: "#14F195", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "minimal", animation: "fade-in", fields: ["coin_name", "cta_primary"] },
        { type: "story", variant: "default", animation: "fade-in", fields: ["headline", "text"] },
        { type: "utility", variant: "horizontal", animation: "horizontal-scroll", fields: ["cards"] },
      ]
    },
    {
      template_id: "premium_pump_fun_hero",
      name: "Pump.fun Hero",
      inspiration: "Pump.fun terminal aesthetic",
      category: "vertical",
      tier: "premium",
      theme: { background: "#0A0A0A", primary: "#14F195", accent: "#14F195", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "minimal", animation: "fade-in", fields: ["coin_name", "cta_primary"] },
        { type: "story", variant: "default", animation: "fade-in", fields: ["text"] },
      ]
    },
    {
      template_id: "premium_chart_maxi",
      name: "Chart Maxi",
      inspiration: "Trader-focused meme tokens",
      category: "horizontal-scroll",
      tier: "premium",
      theme: { background: "#0A0A0A", primary: "#00FF00", accent: "#00FF00", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "centered", animation: "fade-in", fields: ["coin_name"] },
        { type: "utility", variant: "horizontal", animation: "horizontal-scroll", fields: ["cards"] },
      ]
    },
    {
      template_id: "premium_zero_info",
      name: "Zero Info",
      inspiration: "Ultra-minimal brutalist design",
      category: "vertical",
      tier: "premium",
      theme: { background: "#000000", primary: "#FFFFFF", accent: "#FFFFFF", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "minimal", animation: "none", fields: ["coin_name", "cta_primary"] },
      ]
    }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get template meta with fallback
export function getTemplateMeta(templateId: string): TemplateMeta {
  return TEMPLATE_META[templateId] || { 
    emoji: "🎨", 
    tagline: "Custom template", 
    features: [], 
    category: "all" as Category, 
    popularity: 50 
  };
}

// Get template ID from blueprint name
export function getTemplateId(blueprintName: string): string {
  return TEMPLATE_ID_MAP[blueprintName] || "cult_minimal";
}

// Get template by ID from registry
export function getTemplateById(templateId: string): TemplateDefinition | undefined {
  return SOLSITE_TEMPLATE_REGISTRY.templates.find(t => t.template_id === templateId);
}

// Get all template IDs
export function getTemplateIds(): string[] {
  return SOLSITE_TEMPLATE_REGISTRY.templates.map(t => t.template_id);
}

// Get template options for dropdowns/selects
export function getTemplateOptions(): { id: string; name: string; inspiration: string; category: string }[] {
  return SOLSITE_TEMPLATE_REGISTRY.templates.map(t => ({
    id: t.template_id,
    name: t.name,
    inspiration: t.inspiration,
    category: t.category
  }));
}

// Get horizontal scroll template IDs
export function getHorizontalScrollTemplates(): string[] {
  return SOLSITE_TEMPLATE_REGISTRY.templates
    .filter(t => t.category === 'horizontal-scroll')
    .map(t => t.template_id);
}
