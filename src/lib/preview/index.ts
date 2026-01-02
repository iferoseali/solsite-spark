// Preview HTML Generator - Main entry point
import { escapeHtml, sanitizeUrl } from '../htmlSanitize';
import type { ProjectData, TemplateConfig, SanitizedData, FaqItemData, RoadmapPhaseData, TeamMemberData, FeatureData, GalleryImageData, PartnerData, StatItemData } from './types';
import { getTemplateStyles, generateFontUrl } from './styles';
import { generateCss } from './css';
import { SITE_CONFIG } from '../config';
import {
  generateHeader,
  generateHero,
  generateAbout,
  generateStats,
  generateCommunity,
  generateStory,
  generateUtility,
  generateRoadmap,
  generateFaq,
  generateFooter,
  generateTeam,
  generateFeatures,
  generateGallery,
  generatePartners,
  generateStatsMetrics,
} from './sections';

// Re-export types
export type { ProjectData, TemplateConfig, TemplateStyles, SanitizedData } from './types';
export { getTemplateStyles } from './styles';

// Default favicon URL using SITE_CONFIG
const DEFAULT_FAVICON = `${SITE_CONFIG.builtWithUrl}/favicon.png`;

function sanitizeProjectData(project: ProjectData): SanitizedData {
  // Sanitize FAQ items
  const faqItems: FaqItemData[] | undefined = project.faqItems?.map(item => ({
    question: escapeHtml(item.question) || '',
    answer: escapeHtml(item.answer) || '',
  }));

  // Sanitize roadmap phases
  const roadmapPhases: RoadmapPhaseData[] | undefined = project.roadmapPhases?.map(phase => ({
    phase: escapeHtml(phase.phase) || '',
    title: escapeHtml(phase.title) || '',
    items: phase.items.map(item => escapeHtml(item) || ''),
    completed: phase.completed,
  }));

  // Sanitize team members
  const teamMembers: TeamMemberData[] | undefined = project.teamMembers?.map(member => ({
    name: escapeHtml(member.name) || '',
    role: escapeHtml(member.role) || '',
    avatar: member.avatar ? sanitizeUrl(member.avatar) : undefined,
    twitter: member.twitter ? sanitizeUrl(member.twitter) : undefined,
  }));

  // Sanitize features
  const features: FeatureData[] | undefined = project.features?.map(feature => ({
    title: escapeHtml(feature.title) || '',
    description: escapeHtml(feature.description) || '',
    icon: feature.icon,
  }));

  // Sanitize gallery images
  const galleryImages: GalleryImageData[] | undefined = project.galleryImages?.map(image => ({
    url: sanitizeUrl(image.url, true) || '',
    caption: image.caption ? escapeHtml(image.caption) : undefined,
  }));

  // Sanitize partners
  const partners: PartnerData[] | undefined = project.partners?.map(partner => ({
    name: escapeHtml(partner.name) || '',
    logo: sanitizeUrl(partner.logo, true) || '',
    url: partner.url ? sanitizeUrl(partner.url) : undefined,
  }));

  // Sanitize stats
  const stats: StatItemData[] | undefined = project.stats?.map(stat => ({
    value: escapeHtml(stat.value) || '',
    label: escapeHtml(stat.label) || '',
    icon: stat.icon,
  }));

  return {
    coinName: escapeHtml(project.coinName) || 'Your Coin',
    ticker: escapeHtml(project.ticker) || '$TICKER',
    tagline: escapeHtml(project.tagline),
    description: escapeHtml(project.description),
    logoUrl: sanitizeUrl(project.logoUrl, true), // Allow data URLs for preview
    twitter: sanitizeUrl(project.twitter),
    discord: sanitizeUrl(project.discord),
    telegram: sanitizeUrl(project.telegram),
    dexLink: sanitizeUrl(project.dexLink),
    buyNowLink: sanitizeUrl(project.buyNowLink || project.dexLink),
    buyNowText: escapeHtml(project.buyNowText) || 'Buy Now',
    showBuyNow: project.showBuyNow ?? true,
    learnMoreLink: sanitizeUrl(project.learnMoreLink) || '#about',
    learnMoreText: escapeHtml(project.learnMoreText) || 'Learn More',
    showLearnMore: project.showLearnMore ?? true,
    totalSupply: escapeHtml(project.tokenomics?.totalSupply),
    circulatingSupply: escapeHtml(project.tokenomics?.circulatingSupply),
    contractAddress: escapeHtml(project.tokenomics?.contractAddress),
    faqItems,
    roadmapPhases,
    teamMembers,
    features,
    galleryImages,
    partners,
    stats,
  };
}

export function generatePreviewHtml(project: ProjectData, config: TemplateConfig): string {
  const { layout, personality, templateId } = config;
  const styles = getTemplateStyles(templateId, personality);
  const data = sanitizeProjectData(project);
  const fontsUrl = generateFontUrl(styles);

  // Generate all sections (HTML strings)
  const header = generateHeader(data);
  const footer = generateFooter();

  const sectionHtml: Record<string, () => string> = {
    hero: () => generateHero(data),
    about: () => generateAbout(data),
    features: () => generateFeatures(data),
    tokenomics: () => generateStats(data, layout),
    team: () => generateTeam(data),
    community: () => generateCommunity(data, layout),
    story: () => generateStory(data, layout),
    utility: () => generateUtility(data, layout),
    roadmap: () => generateRoadmap(data, project.showRoadmap),
    faq: () => generateFaq(data, project.showFaq),
    gallery: () => generateGallery(data),
    partners: () => generatePartners(data),
    stats: () => generateStatsMetrics(data),
  };

  const orderedSectionTypes = (project.sections && project.sections.length > 0)
    ? project.sections
        .filter((s) => s.visible)
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((s) => s.type)
    : [
        'hero',
        'about',
        'features',
        'tokenomics',
        'team',
        'community',
        'story',
        'utility',
        'roadmap',
        'faq',
      ];

  const bodySections = orderedSectionTypes
    .map((type) => sectionHtml[type]?.())
    .filter(Boolean)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.coinName} (${data.ticker}) - Official Website</title>
  <meta name="description" content="${data.tagline || data.description || `${data.coinName} - The next big thing on Solana`}">
  <link rel="icon" type="image/png" href="${data.logoUrl || DEFAULT_FAVICON}">
  <meta property="og:title" content="${data.coinName} (${data.ticker})">
  <meta property="og:description" content="${data.tagline || data.description || `${data.coinName} - The next big thing on Solana`}">
  <meta property="og:image" content="${data.logoUrl || DEFAULT_FAVICON}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${data.coinName} (${data.ticker})">
  <meta name="twitter:description" content="${data.tagline || data.description || `${data.coinName} - The next big thing on Solana`}">
  <meta name="twitter:image" content="${data.logoUrl || DEFAULT_FAVICON}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">
  <style>${generateCss(styles)}</style>
</head>
<body>
  ${header}
  ${bodySections}
  ${footer}
</body>
</html>`;
}
