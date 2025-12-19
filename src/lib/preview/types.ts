// Preview HTML generator types

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

export interface TokenomicsInput {
  totalSupply?: string;
  circulatingSupply?: string;
  contractAddress?: string;
}

export interface SectionConfig {
  id: string;
  type: string;
  variant: string;
  visible: boolean;
  order: number;
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
  learnMoreLink?: string;
  learnMoreText?: string;
  showRoadmap: boolean;
  showFaq: boolean;
  tokenomics?: TokenomicsInput;
  sections?: SectionConfig[];
  // Custom content
  faqItems?: FaqItemData[];
  roadmapPhases?: RoadmapPhaseData[];
  teamMembers?: TeamMemberData[];
  features?: FeatureData[];
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
  learnMoreLink: string;
  learnMoreText: string;
  totalSupply: string;
  circulatingSupply: string;
  contractAddress: string;
  // Sanitized custom content
  faqItems?: FaqItemData[];
  roadmapPhases?: RoadmapPhaseData[];
  teamMembers?: TeamMemberData[];
  features?: FeatureData[];
}
