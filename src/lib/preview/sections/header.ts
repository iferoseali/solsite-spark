// Header section generator
import type { SanitizedData } from '../types';
import { icons } from '../icons';

export function generateLogoHtml(logoUrl: string, coinName: string, ticker: string): string {
  return logoUrl 
    ? `<img src="${logoUrl}" alt="${coinName}" class="logo-image" />`
    : `<div class="logo-placeholder">${ticker?.[1] || '?'}</div>`;
}

export function generateSocialLinks(data: SanitizedData): string {
  const { twitter, discord, telegram } = data;
  
  return `
    ${twitter ? `<a href="${twitter}" target="_blank" rel="noopener" class="social-link" aria-label="Twitter">${icons.twitter}</a>` : ''}
    ${discord ? `<a href="${discord}" target="_blank" rel="noopener" class="social-link" aria-label="Discord">${icons.discord}</a>` : ''}
    ${telegram ? `<a href="${telegram}" target="_blank" rel="noopener" class="social-link" aria-label="Telegram">${icons.telegram}</a>` : ''}
  `;
}

export function generateHeader(data: SanitizedData): string {
  const logoHtml = generateLogoHtml(data.logoUrl, data.coinName, data.ticker);
  const socialLinks = generateSocialLinks(data);
  
  return `
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo-container">
          ${logoHtml}
          <span class="logo-text">${data.coinName}</span>
        </div>
        <div class="social-links">
          ${socialLinks}
        </div>
      </div>
    </div>
  </header>`;
}
