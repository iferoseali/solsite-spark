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
  | 'utility';

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
};

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'hero-1', type: 'hero', variant: 'centered', visible: true, order: 0 },
  { id: 'about-1', type: 'about', variant: 'centered', visible: true, order: 1 },
  { id: 'tokenomics-1', type: 'tokenomics', variant: 'grid', visible: true, order: 2 },
  { id: 'roadmap-1', type: 'roadmap', variant: 'timeline', visible: true, order: 3 },
  { id: 'faq-1', type: 'faq', variant: 'accordion', visible: true, order: 4 },
];

export function generateSectionId(type: SectionType): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
