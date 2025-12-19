// Community section generator
import type { SanitizedData } from '../types';
import { icons } from '../icons';

export function generateCommunity(data: SanitizedData, layout: string): string {
  if (layout !== 'community' && layout !== 'hero-roadmap') {
    return '';
  }
  
  return `
  <section class="community-section fade-in-section">
    <div class="container">
      <h2 class="section-title">Join the Community</h2>
      <p class="community-subtitle">Connect with fellow ${data.coinName} enthusiasts</p>
      <div class="community-grid">
        ${data.twitter ? `
        <a href="${data.twitter}" target="_blank" rel="noopener" class="community-card twitter">
          <div class="community-icon">${icons.twitterLarge}</div>
          <div class="community-name">Twitter</div>
          <div class="community-action">Follow Us</div>
        </a>
        ` : ''}
        ${data.discord ? `
        <a href="${data.discord}" target="_blank" rel="noopener" class="community-card discord">
          <div class="community-icon">${icons.discordLarge}</div>
          <div class="community-name">Discord</div>
          <div class="community-action">Join Server</div>
        </a>
        ` : ''}
        ${data.telegram ? `
        <a href="${data.telegram}" target="_blank" rel="noopener" class="community-card telegram">
          <div class="community-icon">${icons.telegramLarge}</div>
          <div class="community-name">Telegram</div>
          <div class="community-action">Join Group</div>
        </a>
        ` : ''}
      </div>
    </div>
  </section>`;
}
