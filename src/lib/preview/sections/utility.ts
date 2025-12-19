// Utility section generator
import type { SanitizedData } from '../types';

export function generateUtility(data: SanitizedData, layout: string): string {
  if (layout !== 'utility') {
    return '';
  }
  
  return `
  <section class="utility-section fade-in-section">
    <div class="container">
      <h2 class="section-title">Token Utility</h2>
      <div class="utility-grid">
        <div class="utility-card">
          <div class="utility-icon">🔒</div>
          <h3 class="utility-title">Staking Rewards</h3>
          <p class="utility-desc">Stake your ${data.ticker} to earn passive rewards and participate in governance decisions.</p>
        </div>
        <div class="utility-card">
          <div class="utility-icon">🎮</div>
          <h3 class="utility-title">Exclusive Access</h3>
          <p class="utility-desc">Holders get early access to new features, NFT drops, and community events.</p>
        </div>
        <div class="utility-card">
          <div class="utility-icon">💎</div>
          <h3 class="utility-title">Holder Benefits</h3>
          <p class="utility-desc">Diamond hand rewards, airdrops, and special perks for long-term believers.</p>
        </div>
        <div class="utility-card">
          <div class="utility-icon">🌐</div>
          <h3 class="utility-title">Ecosystem Integration</h3>
          <p class="utility-desc">Use ${data.ticker} across partner platforms and upcoming DeFi integrations.</p>
        </div>
      </div>
    </div>
  </section>`;
}
