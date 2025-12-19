// Hero section generator
import type { SanitizedData } from '../types';
import { generateLogoHtml } from './header';

export function generateHero(data: SanitizedData): string {
  const logoHtml = generateLogoHtml(data.logoUrl, data.coinName, data.ticker);
  
  return `
  <section class="hero">
    <div class="hero-logo">
      ${logoHtml}
    </div>
    <h1 class="hero-title">${data.coinName}</h1>
    <div class="hero-ticker">${data.ticker}</div>
    <p class="hero-tagline">${data.tagline || 'Your awesome tagline goes here'}</p>
    <div class="cta-buttons">
      <a href="${data.buyNowLink || data.dexLink || '#'}" target="_blank" rel="noopener" class="cta-btn cta-btn-primary">
        ${data.buyNowText}
      </a>
      <a href="${data.learnMoreLink || '#about'}" ${data.learnMoreLink && !data.learnMoreLink.startsWith('#') ? 'target="_blank" rel="noopener"' : ''} class="cta-btn cta-btn-secondary">${data.learnMoreText}</a>
    </div>
  </section>`;
}
