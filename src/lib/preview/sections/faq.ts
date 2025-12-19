// FAQ section generator
import type { SanitizedData, FaqItemData } from '../types';
import { escapeHtml } from '@/lib/htmlSanitize';

const DEFAULT_FAQ_ITEMS: FaqItemData[] = [
  { question: 'What is this project?', answer: 'A community-driven meme coin on Solana with massive potential.' },
  { question: 'How do I buy?', answer: 'You can buy on decentralized exchanges like Raydium or Jupiter. Connect your Solana wallet and swap SOL.' },
  { question: 'Is it safe?', answer: 'Always do your own research (DYOR). This is a meme coin and should be treated as a high-risk investment.' },
];

export function generateFaq(data: SanitizedData, showFaq: boolean): string {
  if (!showFaq) {
    return '';
  }

  // Use custom FAQ items if provided, otherwise use defaults with coin name
  const faqItems = data.faqItems && data.faqItems.length > 0
    ? data.faqItems
    : DEFAULT_FAQ_ITEMS.map(item => ({
        question: item.question.replace('this project', data.coinName),
        answer: item.answer,
      }));

  const faqCardsHtml = faqItems.map(item => `
      <div class="faq-card">
        <div class="faq-question">${escapeHtml(item.question)}</div>
        <div class="faq-answer">${escapeHtml(item.answer)}</div>
      </div>`).join('');
  
  return `
  <section class="faq-section fade-in-section">
    <h2 class="section-title">FAQ</h2>
    <div class="faq-grid">
      ${faqCardsHtml}
    </div>
  </section>`;
}
