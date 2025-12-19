// Preview HTML generator types

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
  showRoadmap: boolean;
  showFaq: boolean;
  tokenomics?: TokenomicsInput;
  sections?: SectionConfig[];
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
  totalSupply: string;
  circulatingSupply: string;
  contractAddress: string;
}
