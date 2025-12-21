// Solsite Template System - Consolidated module
// Combines template data, registry, and metadata into a single source of truth

// ============================================
// TYPES
// ============================================

export type Category = "all" | "meme" | "professional" | "gaming" | "tech" | "minimal" | "community" | "premium";
export type SortOption = "name" | "newest" | "popular";

export interface TemplateMeta {
  emoji: string;
  tagline: string;
  features: string[];
  category: Category;
  popularity: number;
  isPremium?: boolean;
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
  "Pump Blast Hero": "pump_blast_hero",
  "Chaos Carousel": "chaos_carousel",
  "Only Up Maxi Chart": "only_up_maxi_chart",
  "Stealth Drop Reveal": "stealth_drop_reveal",
  "Brutalist Pump.fun": "brutalist_pump_fun",
  "Meme Wall Madness": "meme_wall_madness",
  "Trend Hacker": "trend_hacker",
  "Social Rocket": "social_rocket",
};

// Template categories for filtering
export const TEMPLATE_CATEGORIES: CategoryOption[] = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "premium", label: "Premium", emoji: "👑" },
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
  "pump_blast_hero": { emoji: "💥", tagline: "Explosive flashing hero for viral pump launches", features: ["Flash gradient bg", "Shake animations", "Ticker marquee"], category: "premium", popularity: 99, isPremium: true },
  "chaos_carousel": { emoji: "🎪", tagline: "Neon chaos with horizontal snap scroll gallery", features: ["Animated grid bg", "Horizontal scroll", "Glow hover effects"], category: "premium", popularity: 97, isPremium: true },
  "only_up_maxi_chart": { emoji: "📈", tagline: "Terminal green with live chart focus", features: ["Grid dark bg", "Chart widget", "Monospace aesthetic"], category: "premium", popularity: 96, isPremium: true },
  "stealth_drop_reveal": { emoji: "🕵️", tagline: "Mysterious blackout with countdown reveal", features: ["Grain texture", "Glitch hover", "Countdown timer"], category: "premium", popularity: 95, isPremium: true },
  "brutalist_pump_fun": { emoji: "◾", tagline: "Raw brutalist design, pure pump.fun energy", features: ["No animations", "Pure black/white", "Bold sans-serif"], category: "premium", popularity: 94, isPremium: true },
  "meme_wall_madness": { emoji: "🖼️", tagline: "Neon meme gallery with horizontal snap scroll", features: ["Animated neon bg", "Image carousel", "Glow pop effects"], category: "premium", popularity: 93, isPremium: true },
  "trend_hacker": { emoji: "🐦", tagline: "Twitter-trend inspired with hashtag showcase", features: ["Grid dark bg", "Trending section", "Tilt hover effects"], category: "premium", popularity: 92, isPremium: true },
  "social_rocket": { emoji: "🚀", tagline: "Social-first with parallax scroll and links", features: ["Gradient dark bg", "Parallax scroll", "Social card carousel"], category: "premium", popularity: 91, isPremium: true },
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
    // ============================================
    // PREMIUM TEMPLATES
    // ============================================
    {
      template_id: "pump_blast_hero",
      name: "Pump Blast Hero",
      inspiration: "Viral pump launches, high-energy meme coins",
      category: "horizontal-scroll",
      theme: { background: "#0a0a0a", primary: "#14F195", accent: "#ff4fd8", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "fullscreen", animation: "bounce", fields: ["coin_name", "ticker", "tagline", "logo"] },
        { type: "tokenomics", variant: "horizontal", animation: "horizontal-scroll", fields: ["stats"] },
        { type: "community", variant: "default", animation: "fade-up", fields: ["socials"] },
      ]
    },
    {
      template_id: "chaos_carousel",
      name: "Chaos Carousel",
      inspiration: "Neon chaos galleries, meme culture",
      category: "horizontal-scroll",
      theme: { background: "#0d0d1a", primary: "#FF00FF", accent: "#00ffff", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "centered", animation: "fade-in", fields: ["coin_name", "ticker", "tagline"] },
        { type: "utility", variant: "default", animation: "horizontal-scroll", fields: ["features"] },
        { type: "tokenomics", variant: "horizontal", animation: "horizontal-scroll", fields: ["stats"] },
        { type: "community", variant: "default", animation: "fade-up", fields: ["socials"] },
      ]
    },
    {
      template_id: "only_up_maxi_chart",
      name: "Only Up Maxi Chart",
      inspiration: "Trading terminals, chart-focused sites",
      category: "vertical",
      theme: { background: "#0a0a0a", primary: "#00FF00", accent: "#00cc00", text: "#00FF00" },
      sections: [
        { type: "hero", variant: "minimal", animation: "fade-in", fields: ["coin_name", "ticker", "tagline"] },
        { type: "tokenomics", variant: "grid", animation: "fade-up", fields: ["stats"] },
        { type: "roadmap", variant: "timeline", animation: "fade-up", fields: ["phases"] },
        { type: "community", variant: "default", animation: "fade-in", fields: ["socials"] },
      ]
    },
    {
      template_id: "stealth_drop_reveal",
      name: "Stealth Drop Reveal",
      inspiration: "Mysterious launches, countdown reveals",
      category: "vertical",
      theme: { background: "#050505", primary: "#ffffff", accent: "#888888", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "centered", animation: "fade-in", fields: ["coin_name", "ticker", "tagline"] },
        { type: "story", variant: "default", animation: "parallax", fields: ["lore"] },
        { type: "tokenomics", variant: "cards", animation: "fade-up", fields: ["stats"] },
        { type: "community", variant: "default", animation: "fade-in", fields: ["socials"] },
      ]
    },
    {
      template_id: "brutalist_pump_fun",
      name: "Brutalist Pump.fun",
      inspiration: "Raw brutalist design, anti-design movement",
      category: "vertical",
      theme: { background: "#000000", primary: "#ffffff", accent: "#ffffff", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "minimal", animation: "none", fields: ["coin_name", "ticker", "tagline", "logo"] },
        { type: "tokenomics", variant: "grid", animation: "none", fields: ["stats"] },
        { type: "faq", variant: "default", animation: "none", fields: ["items"] },
        { type: "community", variant: "default", animation: "none", fields: ["socials"] },
      ]
    },
    {
      template_id: "meme_wall_madness",
      name: "Meme Wall Madness",
      inspiration: "Neon galleries, meme showcases",
      category: "horizontal-scroll",
      theme: { background: "#0a0014", primary: "#FF00FF", accent: "#ff6600", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "fullscreen", animation: "bounce", fields: ["coin_name", "ticker", "tagline", "logo"] },
        { type: "utility", variant: "default", animation: "horizontal-scroll", fields: ["features"] },
        { type: "tokenomics", variant: "horizontal", animation: "horizontal-scroll", fields: ["stats"] },
        { type: "community", variant: "default", animation: "fade-up", fields: ["socials"] },
      ]
    },
    {
      template_id: "trend_hacker",
      name: "Trend Hacker",
      inspiration: "Twitter trends, social virality",
      category: "vertical",
      theme: { background: "#0a0a12", primary: "#1DA1F2", accent: "#00acee", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "split", animation: "fade-in", fields: ["coin_name", "ticker", "tagline"] },
        { type: "tokenomics", variant: "cards", animation: "stagger", fields: ["stats"] },
        { type: "roadmap", variant: "cards", animation: "fade-up", fields: ["phases"] },
        { type: "community", variant: "default", animation: "fade-in", fields: ["socials"] },
      ]
    },
    {
      template_id: "social_rocket",
      name: "Social Rocket",
      inspiration: "Social-first launches, community focus",
      category: "horizontal-scroll",
      theme: { background: "#0a1020", primary: "#1DA1F2", accent: "#22c55e", text: "#ffffff" },
      sections: [
        { type: "hero", variant: "centered", animation: "parallax", fields: ["coin_name", "ticker", "tagline", "logo"] },
        { type: "utility", variant: "default", animation: "horizontal-scroll", fields: ["features"] },
        { type: "tokenomics", variant: "horizontal", animation: "horizontal-scroll", fields: ["stats"] },
        { type: "community", variant: "default", animation: "fade-up", fields: ["socials"] },
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
