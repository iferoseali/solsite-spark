// Preview HTML Generator - Main entry point
import { escapeHtml, sanitizeUrl } from '../htmlSanitize';
import type { ProjectData, TemplateConfig, SanitizedData } from './types';
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
} from './sections';

// Re-export types
export type { ProjectData, TemplateConfig, TemplateStyles, SanitizedData } from './types';
export { getTemplateStyles } from './styles';

function sanitizeProjectData(project: ProjectData): SanitizedData {
  return {
    coinName: escapeHtml(project.coinName) || 'Your Coin',
    ticker: escapeHtml(project.ticker) || '$TICKER',
    tagline: escapeHtml(project.tagline),
    description: escapeHtml(project.description),
    logoUrl: sanitizeUrl(project.logoUrl),
    twitter: sanitizeUrl(project.twitter),
    discord: sanitizeUrl(project.discord),
    telegram: sanitizeUrl(project.telegram),
    dexLink: sanitizeUrl(project.dexLink),
    totalSupply: escapeHtml(project.tokenomics?.totalSupply),
    circulatingSupply: escapeHtml(project.tokenomics?.circulatingSupply),
    contractAddress: escapeHtml(project.tokenomics?.contractAddress),
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
  const roadmap = generateRoadmap(project.showRoadmap);
  const faq = generateFaq(data, project.showFaq);
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
  ${stats}
  ${community}
  ${story}
  ${utility}
  ${roadmap}
  ${faq}
  ${footer}
</body>
</html>`;
}
