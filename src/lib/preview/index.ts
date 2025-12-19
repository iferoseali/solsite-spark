// Preview HTML Generator - Main entry point
import { escapeHtml, sanitizeUrl } from '../htmlSanitize';
import type { ProjectData, TemplateConfig, SanitizedData, FaqItemData, RoadmapPhaseData, TeamMemberData, FeatureData } from './types';
import { getTemplateStyles, generateFontUrl } from './styles';
import { generateCss } from './css';
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
} from './sections';

// Re-export types
export type { ProjectData, TemplateConfig, TemplateStyles, SanitizedData } from './types';
export { getTemplateStyles } from './styles';

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
    totalSupply: escapeHtml(project.tokenomics?.totalSupply),
    circulatingSupply: escapeHtml(project.tokenomics?.circulatingSupply),
    contractAddress: escapeHtml(project.tokenomics?.contractAddress),
    faqItems,
    roadmapPhases,
    teamMembers,
    features,
  };
}

export function generatePreviewHtml(project: ProjectData, config: TemplateConfig): string {
  const { layout, personality, templateId } = config;
  const styles = getTemplateStyles(templateId, personality);
  const data = sanitizeProjectData(project);
  const fontsUrl = generateFontUrl(styles);

  // Generate all sections
  const header = generateHeader(data);
  const hero = generateHero(data);
  const about = generateAbout(data);
  const stats = generateStats(data, layout);
  const community = generateCommunity(data, layout);
  const story = generateStory(data, layout);
  const utility = generateUtility(data, layout);
  const roadmap = generateRoadmap(data, project.showRoadmap);
  const faq = generateFaq(data, project.showFaq);
  const team = generateTeam(data);
  const features = generateFeatures(data);
  const footer = generateFooter();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.coinName} (${data.ticker}) - Official Website</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsUrl}" rel="stylesheet">
  <style>${generateCss(styles)}</style>
</head>
<body>
  ${header}
  ${hero}
  ${about}
  ${features}
  ${stats}
  ${team}
  ${community}
  ${story}
  ${utility}
  ${roadmap}
  ${faq}
  ${footer}
</body>
</html>`;
}
