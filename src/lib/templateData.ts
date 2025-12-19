// Consolidated template data - single source of truth

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
};

// Helper function to get template meta with fallback
export const getTemplateMeta = (templateId: string): TemplateMeta => {
  return TEMPLATE_META[templateId] || { 
    emoji: "🎨", 
    tagline: "Custom template", 
    features: [], 
    category: "all" as Category, 
    popularity: 50 
  };
};

// Helper function to get template ID from blueprint name
export const getTemplateId = (blueprintName: string): string => {
  return TEMPLATE_ID_MAP[blueprintName] || "cult_minimal";
};
