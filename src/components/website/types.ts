// Website renderer types

export interface ProjectData {
  id?: string;
  coinName: string;
  ticker: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  twitter: string;
  discord: string;
  telegram: string;
  dexLink: string;
  showRoadmap: boolean;
  showFaq: boolean;
  // Extended fields
  tokenomics?: TokenomicsData;
  team?: TeamMember[];
  roadmapPhases?: RoadmapPhase[];
  faqItems?: FaqItem[];
  ctaButtons?: CtaButton[];
}

export interface TokenomicsData {
  totalSupply: string;
  holders: string;
  marketCap: string;
  tax: string;
  burned?: string;
  liquidity?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  twitter?: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  items: string[];
  completed?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CtaButton {
  label: string;
  url: string;
  variant: 'primary' | 'secondary';
}

export interface TemplateConfig {
  layout: string;
  personality: string;
}

export interface PersonalityStyles {
  primary: string;
  accent: string;
  bgGradient: string;
}

export function getPersonalityStyles(personality: string): PersonalityStyles {
  switch (personality) {
    case 'degen':
      return { primary: '#ff4444', accent: '#ff8800', bgGradient: 'linear-gradient(135deg, #1a0505 0%, #2d1810 100%)' };
    case 'professional':
      return { primary: '#00d4ff', accent: '#0088ff', bgGradient: 'linear-gradient(135deg, #0a1628 0%, #0d2137 100%)' };
    case 'dark-cult':
      return { primary: '#a855f7', accent: '#ec4899', bgGradient: 'linear-gradient(135deg, #150520 0%, #1f0a30 100%)' };
    case 'playful':
      return { primary: '#fbbf24', accent: '#22c55e', bgGradient: 'linear-gradient(135deg, #1a1a0a 0%, #0a1a10 100%)' };
    case 'premium':
      return { primary: '#d4af37', accent: '#c0c0c0', bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' };
    default:
      return { primary: '#00d4ff', accent: '#22c55e', bgGradient: 'linear-gradient(135deg, #0a0f1a 0%, #0d1520 100%)' };
  }
}
