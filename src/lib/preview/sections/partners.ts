// Partners section HTML generator
import type { SanitizedData } from '../types';

export function generatePartners(data: SanitizedData): string {
  if (!data.partners || data.partners.length === 0) {
    return '';
  }

  // Create duplicate logos for seamless marquee effect
  const logosHtml = [...data.partners, ...data.partners].map((partner) => `
    <div style="
      flex-shrink: 0;
      padding: 0 32px;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
      ${partner.url ? `<a href="${partner.url}" target="_blank" rel="noopener noreferrer" style="display: block;">` : ''}
        <img 
          src="${partner.logo}" 
          alt="${partner.name}"
          style="
            height: 48px;
            width: auto;
            max-width: 150px;
            object-fit: contain;
            filter: grayscale(100%) brightness(2);
            transition: filter 0.3s ease;
          "
          onmouseover="this.style.filter='grayscale(0%) brightness(1)'"
          onmouseout="this.style.filter='grayscale(100%) brightness(2)'"
        />
      ${partner.url ? '</a>' : ''}
    </div>
  `).join('');

  return `
    <section id="partners" style="
      padding: 60px 20px;
      background: rgba(0,0,0,0.3);
      overflow: hidden;
    ">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h3 style="
          text-align: center;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: var(--muted, #888);
          margin-bottom: 32px;
        ">Trusted By</h3>
        <div class="partners-marquee" style="
          display: flex;
          animation: scroll 30s linear infinite;
          width: max-content;
        ">
          ${logosHtml}
        </div>
      </div>
      <style>
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partners-marquee:hover {
          animation-play-state: paused;
        }
      </style>
    </section>
  `;
}
