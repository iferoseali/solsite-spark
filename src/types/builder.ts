// Builder form data types

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  items: string[];
  completed: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  twitter?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

// New section types
export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon?: string;
}

export interface BuilderFormData {
  // Basic Info
  coinName: string;
  ticker: string;
  tagline: string;
  description: string;
  // Socials
  twitter: string;
  discord: string;
  telegram: string;
  dexLink: string;
  // Toggles (derived from sections)
  showRoadmap: boolean;
  showFaq: boolean;
  // Tokenomics
  totalSupply: string;
  circulatingSupply: string;
  contractAddress: string;
  // Custom Content
  faqItems: FaqItem[];
  roadmapPhases: RoadmapPhase[];
  teamMembers: TeamMember[];
  features: Feature[];
  galleryImages: GalleryImage[];
  partners: Partner[];
  stats: StatItem[];
}

// Default FAQ items
export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  { id: 'faq-1', question: 'What is this project?', answer: 'A community-driven meme coin on Solana with massive potential.' },
  { id: 'faq-2', question: 'How do I buy?', answer: 'You can buy on decentralized exchanges like Raydium or Jupiter. Connect your Solana wallet and swap SOL.' },
  { id: 'faq-3', question: 'Is it safe?', answer: 'Always do your own research (DYOR). This is a meme coin and should be treated as a high-risk investment.' },
];

// Default roadmap phases
export const DEFAULT_ROADMAP_PHASES: RoadmapPhase[] = [
  { id: 'phase-1', phase: 'Phase 1', title: 'Launch', items: ['Token launch on Solana', 'Website & socials live', 'Community building'], completed: false },
  { id: 'phase-2', phase: 'Phase 2', title: 'Growth', items: ['CEX listings', 'Marketing campaigns', 'Partnerships'], completed: false },
  { id: 'phase-3', phase: 'Phase 3', title: 'Moon', items: ['Major exchange listings', 'Ecosystem expansion', 'To the moon 🚀'], completed: false },
];

// Default team members
export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [];

// Default features
export const DEFAULT_FEATURES: Feature[] = [
  { id: 'feature-1', title: 'Lightning Fast', description: 'Built on Solana for instant transactions and minimal fees.', icon: '⚡' },
  { id: 'feature-2', title: 'Community First', description: 'Decisions are made by the community through governance.', icon: '🤝' },
  { id: 'feature-3', title: 'Secure', description: 'Audited smart contracts and transparent tokenomics.', icon: '🔒' },
];

// Default gallery images
export const DEFAULT_GALLERY_IMAGES: GalleryImage[] = [
  { id: 'gallery-1', url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop', caption: 'Community Event' },
  { id: 'gallery-2', url: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=400&fit=crop', caption: 'Token Launch' },
];

// Default partners
export const DEFAULT_PARTNERS: Partner[] = [
  { id: 'partner-1', name: 'Solana', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029', url: 'https://solana.com' },
  { id: 'partner-2', name: 'Jupiter', logo: 'https://jup.ag/svg/jupiter-logo.svg', url: 'https://jup.ag' },
];

// Default stats
export const DEFAULT_STATS: StatItem[] = [
  { id: 'stat-1', value: '10K+', label: 'Holders', icon: '👥' },
  { id: 'stat-2', value: '$1M+', label: 'Market Cap', icon: '💰' },
  { id: 'stat-3', value: '50K+', label: 'Transactions', icon: '⚡' },
];

// Generate unique IDs
export function generateItemId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
