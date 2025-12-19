// About section generator
import type { SanitizedData } from '../types';

export function generateAbout(data: SanitizedData): string {
  if (!data.description) return '';
  
  return `
  <section class="about-section fade-in-section" id="about">
    <div class="container">
      <h2 class="section-title">About ${data.coinName}</h2>
      <p class="about-text">${data.description}</p>
    </div>
  </section>`;
}
