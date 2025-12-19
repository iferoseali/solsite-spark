// Stats/Tokenomics section generator
import type { SanitizedData } from '../types';

export function generateStats(data: SanitizedData, layout: string): string {
  const hasCustomTokenomics = data.totalSupply || data.circulatingSupply || data.contractAddress;
  
  if (layout !== 'stats-heavy' && layout !== 'hero-roadmap' && !hasCustomTokenomics) {
    return '';
  }
  
  return `
  <section class="stats-section fade-in-section">
    <div class="container">
      <h2 class="section-title">Tokenomics</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${data.totalSupply || '1B+'}</div>
          <div class="stat-label">Total Supply</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.circulatingSupply || 'TBA'}</div>
          <div class="stat-label">Circulating</div>
        </div>
        ${data.contractAddress ? `
        <div class="stat-card contract-card">
          <div class="stat-value contract-address" title="${data.contractAddress}">${data.contractAddress.slice(0, 6)}...${data.contractAddress.slice(-4)}</div>
          <div class="stat-label">Contract</div>
        </div>
        ` : ''}
      </div>
    </div>
  </section>`;
}
