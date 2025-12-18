// Template Blueprint Types for Internal Template Builder

export interface SectionDefinition {
  type: 'hero' | 'about' | 'tokenomics' | 'roadmap' | 'faq' | 'community' | 'story' | 'utility' | 'team' | 'footer';
  order: number;
  visible: boolean;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'none';
  config?: Record<string, any>;
}

export interface StyleConfig {
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
  fontHeading?: string;
  fontBody?: string;
  borderRadius?: string;
  glowEffect?: boolean;
}

export interface AnimationConfig {
  scrollFade: boolean;
  hoverScale: number;
  transitionDuration: string;
  heroAnimation?: 'float' | 'pulse' | 'glow' | 'none';
}

export interface TemplateBlueprint {
  id: string;
  name: string;
  reference_url?: string;
  sections: SectionDefinition[];
  styles: StyleConfig;
  animations: AnimationConfig;
  layout_category?: string;
  personality?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalysisResult {
  sections: {
    type: string;
    confidence: number;
    notes?: string;
  }[];
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  typography: {
    headingStyle: string;
    bodyStyle: string;
  };
  animations: {
    detected: string[];
    notes?: string;
  };
  layoutCategory: string;
  personality: string;
}

export const DEFAULT_SECTIONS: SectionDefinition[] = [
  { type: 'hero', order: 1, visible: true, animation: 'fade-up' },
  { type: 'about', order: 2, visible: true, animation: 'fade-in' },
  { type: 'tokenomics', order: 3, visible: true, animation: 'fade-up' },
  { type: 'roadmap', order: 4, visible: true, animation: 'fade-in' },
  { type: 'community', order: 5, visible: true, animation: 'fade-up' },
  { type: 'faq', order: 6, visible: true, animation: 'fade-in' },
  { type: 'footer', order: 7, visible: true, animation: 'none' },
];

export const DEFAULT_STYLES: StyleConfig = {
  primaryColor: '#00d4ff',
  accentColor: '#22c55e',
  bgGradient: 'linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%)',
  fontHeading: 'Outfit',
  fontBody: 'Space Grotesk',
  borderRadius: '12px',
  glowEffect: true,
};

export const DEFAULT_ANIMATIONS: AnimationConfig = {
  scrollFade: true,
  hoverScale: 1.05,
  transitionDuration: '0.3s',
  heroAnimation: 'float',
};

export const SECTION_OPTIONS = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'about', label: 'About / Description' },
  { value: 'tokenomics', label: 'Tokenomics / Stats' },
  { value: 'roadmap', label: 'Roadmap' },
  { value: 'faq', label: 'FAQ' },
  { value: 'community', label: 'Community / Socials' },
  { value: 'story', label: 'Story / Lore' },
  { value: 'utility', label: 'Utility' },
  { value: 'team', label: 'Team' },
  { value: 'footer', label: 'Footer' },
];

export const PERSONALITY_OPTIONS = [
  { value: 'degen', label: 'Degen', description: 'Bold, aggressive, high energy' },
  { value: 'professional', label: 'Professional', description: 'Clean, corporate, trustworthy' },
  { value: 'dark-cult', label: 'Dark Cult', description: 'Mysterious, exclusive, cult-like' },
  { value: 'playful', label: 'Playful', description: 'Fun, colorful, meme-friendly' },
  { value: 'premium', label: 'Premium', description: 'Luxurious, gold accents, exclusive' },
];

export const LAYOUT_CATEGORIES = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'hero-roadmap', label: 'Hero + Roadmap' },
  { value: 'stats-heavy', label: 'Stats Heavy' },
  { value: 'community', label: 'Community Focus' },
  { value: 'story-lore', label: 'Story / Lore' },
  { value: 'utility', label: 'Utility Focus' },
];
