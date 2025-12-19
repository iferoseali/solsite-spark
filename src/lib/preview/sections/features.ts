// Features/Utility section generator
import type { SanitizedData, FeatureData } from '../types';
import { escapeHtml } from '@/lib/htmlSanitize';

export function generateFeatures(data: SanitizedData): string {
  if (!data.features || data.features.length === 0) {
    return '';
  }

  const featureCardsHtml = data.features.map(feature => `
      <div class="feature-card">
        <div class="feature-icon">${feature.icon || '⚡'}</div>
        <div class="feature-title">${escapeHtml(feature.title)}</div>
        <div class="feature-desc">${escapeHtml(feature.description)}</div>
      </div>`).join('');
  
  return `
  <section class="features-section fade-in-section">
    <h2 class="section-title">Features</h2>
    <div class="features-grid">
      ${featureCardsHtml}
    </div>
  </section>`;
}
