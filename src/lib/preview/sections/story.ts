// Story section generator
import type { SanitizedData } from '../types';

export function generateStory(data: SanitizedData, layout: string): string {
  if (layout !== 'story-lore') {
    return '';
  }
  
  return `
  <section class="story-section fade-in-section">
    <div class="container">
      <h2 class="section-title">The Legend of ${data.coinName}</h2>
      <div class="story-content">
        <div class="story-chapter">
          <div class="chapter-number">Chapter I</div>
          <h3 class="chapter-title">The Beginning</h3>
          <p class="chapter-text">${data.description || `In the vast digital cosmos of Solana, a new force emerged. ${data.coinName} was born from the collective dreams of degens and visionaries alike.`}</p>
        </div>
        <div class="story-chapter">
          <div class="chapter-number">Chapter II</div>
          <h3 class="chapter-title">The Journey</h3>
          <p class="chapter-text">As word spread across the blockchain, believers gathered. Each holder became part of something greater—a movement that transcended mere transactions.</p>
        </div>
        <div class="story-chapter">
          <div class="chapter-number">Chapter III</div>
          <h3 class="chapter-title">The Future</h3>
          <p class="chapter-text">The path ahead glows with promise. With diamond hands and unwavering conviction, the community marches toward the moon.</p>
        </div>
      </div>
    </div>
  </section>`;
}
