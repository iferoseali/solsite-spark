// Section configuration types

export interface SectionConfig {
  id: string;
  type: SectionType;
  variant: string;
  visible: boolean;
  order: number;
}

export type SectionType = 
  | 'hero' 
  | 'about' 
  | 'tokenomics' 
  | 'roadmap' 
  | 'faq' 
  | 'community' 
  | 'team' 
  | 'story' 
  | 'utility'
  | 'features'
  | 'gallery'
  | 'partners'
  | 'stats';

export interface SectionVariant {
  value: string;
  label: string;
}

export const SECTION_VARIANTS: Record<SectionType, SectionVariant[]> = {
  hero: [
    { value: 'centered', label: 'Centered' },
    { value: 'split', label: 'Split Layout' },
    { value: 'fullscreen', label: 'Full Screen' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'asymmetric', label: 'Asymmetric' },
  ],
  about: [
    { value: 'centered', label: 'Centered' },
    { value: 'split', label: 'Split with Features' },
    { value: 'cards', label: 'Feature Cards' },
  ],
  tokenomics: [
    { value: 'grid', label: 'Stats Grid' },
    { value: 'cards', label: 'Large Cards' },
    { value: 'horizontal', label: 'Horizontal Scroll' },
    { value: 'circular', label: 'Pie Chart' },
  ],
  roadmap: [
    { value: 'timeline', label: 'Vertical Timeline' },
    { value: 'horizontal', label: 'Horizontal Scroll' },
    { value: 'cards', label: 'Phase Cards' },
    { value: 'zigzag', label: 'Zigzag' },
  ],
  faq: [
    { value: 'accordion', label: 'Accordion' },
    { value: 'grid', label: 'Grid Layout' },
  ],
  community: [
    { value: 'socials', label: 'Social Buttons' },
    { value: 'cards', label: 'Social Cards' },
  ],
  team: [
    { value: 'grid', label: 'Avatar Grid' },
    { value: 'cards', label: 'Team Cards' },
  ],
  story: [
    { value: 'default', label: 'Story Chapters' },
  ],
  utility: [
    { value: 'default', label: 'Utility Features' },
  ],
  features: [
    { value: 'grid', label: 'Feature Grid' },
    { value: 'cards', label: 'Feature Cards' },
  ],
  gallery: [
    { value: 'grid', label: 'Grid Layout' },
    { value: 'masonry', label: 'Masonry' },
    { value: 'carousel', label: 'Carousel' },
  ],
  partners: [
    { value: 'marquee', label: 'Scrolling Marquee' },
    { value: 'grid', label: 'Logo Grid' },
  ],
  stats: [
    { value: 'grid', label: 'Stats Grid' },
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'cards', label: 'Stat Cards' },
  ],
};

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Hero Section',
  about: 'About',
  tokenomics: 'Tokenomics',
  roadmap: 'Roadmap',
  faq: 'FAQ',
  community: 'Community',
  team: 'Team',
  story: 'Story',
  utility: 'Utility',
  features: 'Features',
  gallery: 'Gallery',
  partners: 'Partners',
  stats: 'Stats',
};

export const SECTION_ICONS: Record<SectionType, string> = {
  hero: '🏠',
  about: '📖',
  tokenomics: '📊',
  roadmap: '🗺️',
  faq: '❓',
  community: '👥',
  team: '🧑‍🤝‍🧑',
  story: '📜',
  utility: '⚡',
  features: '✨',
  gallery: '🖼️',
  partners: '🤝',
  stats: '📈',
};

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'hero-1', type: 'hero', variant: 'centered', visible: true, order: 0 },
  { id: 'about-1', type: 'about', variant: 'centered', visible: true, order: 1 },
  { id: 'stats-1', type: 'stats', variant: 'grid', visible: true, order: 2 },
  { id: 'features-1', type: 'features', variant: 'grid', visible: true, order: 3 },
  { id: 'gallery-1', type: 'gallery', variant: 'grid', visible: true, order: 4 },
  { id: 'partners-1', type: 'partners', variant: 'marquee', visible: true, order: 5 },
  { id: 'tokenomics-1', type: 'tokenomics', variant: 'grid', visible: true, order: 6 },
  { id: 'roadmap-1', type: 'roadmap', variant: 'timeline', visible: true, order: 7 },
  { id: 'faq-1', type: 'faq', variant: 'accordion', visible: true, order: 8 },
];

export function generateSectionId(type: SectionType): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Map blueprint section types to our SectionType
const BLUEPRINT_TYPE_MAP: Record<string, SectionType | null> = {
  hero: 'hero',
  about: 'about',
  tokenomics: 'tokenomics',
  stats: 'stats',
  roadmap: 'roadmap',
  faq: 'faq',
  community: 'community',
  team: 'team',
  story: 'story',
  narrative: 'story',
  utility: 'utility',
  features: 'features',
  rituals: 'utility',
  gallery: 'gallery',
  partners: 'partners',
  sponsors: 'partners',
  // These types are not mapped (footer, cta, etc.)
  footer: null,
  cta: null,
};

export function mapBlueprintTypeToSectionType(blueprintType: string | undefined | null): SectionType | null {
  if (!blueprintType) return null;
  return BLUEPRINT_TYPE_MAP[blueprintType.toLowerCase()] ?? null;
}
