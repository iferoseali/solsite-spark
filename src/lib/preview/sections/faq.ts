// FAQ section generator
import type { SanitizedData } from '../types';

export function generateFaq(data: SanitizedData, showFaq: boolean): string {
  if (!showFaq) {
    return '';
  }
  
  return `
  <section class="faq-section fade-in-section">
    <h2 class="section-title">FAQ</h2>
    <div class="faq-grid">
      <div class="faq-card">
        <div class="faq-question">What is ${data.coinName}?</div>
        <div class="faq-answer">${data.description || `${data.coinName} is a community-driven meme coin on Solana with massive potential.`}</div>
      </div>
      <div class="faq-card">
        <div class="faq-question">How do I buy ${data.ticker}?</div>
        <div class="faq-answer">You can buy on decentralized exchanges like Raydium or Jupiter. Connect your Solana wallet and swap SOL.</div>
      </div>
      <div class="faq-card">
        <div class="faq-question">Is ${data.coinName} safe?</div>
        <div class="faq-answer">Always do your own research (DYOR). This is a meme coin and should be treated as a high-risk investment.</div>
      </div>
    </div>
  </section>`;
}
