// Preview HTML generator types
// Import SectionConfig from centralized types
import type { SectionConfig } from "@/types/section";

// Re-export for consumers
export type { SectionConfig };
export interface FaqItemData {
  question: string;
  answer: string;
}

export interface RoadmapPhaseData {
  phase: string;
  title: string;
  items: string[];
  completed?: boolean;
}

export interface TeamMemberData {
  name: string;
  role: string;
  avatar?: string;
  twitter?: string;
}

export interface FeatureData {
  title: string;
  description: string;
  icon?: string;
}

export interface GalleryImageData {
  url: string;
  caption?: string;
}

export interface PartnerData {
  name: string;
  logo: string;
  url?: string;
}

export interface StatItemData {
  value: string;
  label: string;
  icon?: string;
}

export interface TokenomicsInput {
  totalSupply?: string;
  circulatingSupply?: string;
  contractAddress?: string;
}

export interface ProjectData {
  coinName: string;
  ticker: string;
  tagline: string;
  description: string;
  logoUrl: string | null;
  twitter: string;
  discord: string;
  telegram: string;
  dexLink: string;
  buyNowLink?: string;
  buyNowText?: string;
  showBuyNow?: boolean;
  learnMoreLink?: string;
  learnMoreText?: string;
  showLearnMore?: boolean;
  showRoadmap: boolean;
  showFaq: boolean;
  tokenomics?: TokenomicsInput;
  sections?: SectionConfig[];
  // Custom content
  faqItems?: FaqItemData[];
  roadmapPhases?: RoadmapPhaseData[];
  teamMembers?: TeamMemberData[];
  features?: FeatureData[];
  galleryImages?: GalleryImageData[];
  partners?: PartnerData[];
  stats?: StatItemData[];
}

export interface TemplateConfig {
  layout: string;
  personality: string;
  templateId?: string;
}

export interface TemplateStyles {
  primary: string;
  accent: string;
  bgGradient: string;
  bgColor: string;
  text: string;
  muted: string;
  fontHeading: string;
  fontBody: string;
}

export interface SanitizedData {
  coinName: string;
  ticker: string;
  tagline: string;
  description: string;
  logoUrl: string;
  twitter: string;
  discord: string;
  telegram: string;
  dexLink: string;
  buyNowLink: string;
  buyNowText: string;
  showBuyNow: boolean;
  learnMoreLink: string;
  learnMoreText: string;
  showLearnMore: boolean;
  totalSupply: string;
  circulatingSupply: string;
  contractAddress: string;
  // Sanitized custom content
  faqItems?: FaqItemData[];
  roadmapPhases?: RoadmapPhaseData[];
  teamMembers?: TeamMemberData[];
  features?: FeatureData[];
  galleryImages?: GalleryImageData[];
  partners?: PartnerData[];
  stats?: StatItemData[];
}
