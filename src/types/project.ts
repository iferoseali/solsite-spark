// Project-related types

import type { SectionConfig } from "./section";

export interface Project {
  id: string;
  coin_name: string;
  ticker: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  twitter_url: string | null;
  discord_url: string | null;
  telegram_url: string | null;
  dex_link: string | null;
  show_roadmap: boolean | null;
  show_faq: boolean | null;
  status: string | null;
  subdomain: string | null;
  generated_url: string | null;
  template_id: string | null;
  user_id: string | null;
  config: ProjectConfig | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectConfig {
  tokenomics?: TokenomicsConfig;
  sections?: SectionConfig[];
  templateId?: string | null;
  blueprintId?: string | null;
}

export interface TokenomicsConfig {
  totalSupply?: string | null;
  circulatingSupply?: string | null;
  contractAddress?: string | null;
}

export interface CreateProjectData {
  coinName: string;
  ticker: string;
  tagline?: string;
  description?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  dexLink?: string;
  showRoadmap?: boolean;
  showFaq?: boolean;
  templateId?: string;
  subdomain: string;
  userId: string;
  config?: ProjectConfig;
}

export interface UpdateProjectData {
  coin_name?: string;
  ticker?: string;
  tagline?: string | null;
  description?: string | null;
  logo_url?: string | null;
  twitter_url?: string | null;
  discord_url?: string | null;
  telegram_url?: string | null;
  dex_link?: string | null;
  show_roadmap?: boolean;
  show_faq?: boolean;
  config?: ProjectConfig;
  status?: string;
}

// For the preview HTML generator
export interface ProjectPreviewData {
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
  tokenomics?: TokenomicsConfig;
  sections?: SectionConfig[];
}
